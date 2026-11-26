#!/usr/bin/env node
// ============================================================
// Bot test for airport transfers: many virtual delegates and busy organizers
// at once, then checks that every delegate ends up on exactly the bus the
// organizers chose, sees it, and that nothing leaks to the wrong people.
// No packages, Node 20+.
//
// Local run (safe, in-memory storage):
//   ADMIN_EMAILS=bus-admin@test.invalid RATE_IP_REGISTER=100000 RATE_USER_MIN=100000 node dev-server.js
//   node scripts/transfer-bots.mjs --users 600 --buses 15
// ============================================================

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return acc;
  }, [])
);
const URL_ = String(args.url || "http://localhost:3000").replace(/\/+$/, "");
const USERS = Number(args.users || 600);
const BUSES = Number(args.buses || 15);
const STORM_S = Number(args.storm || 40);
const ADMIN_EMAIL = "bus-admin@test.invalid";
const PASSWORD = "bus-bot-password-77";
if (!/^http:\/\/(localhost|127\.0\.0\.1)/.test(URL_)) {
  console.error("This bot test only runs against a local server.");
  process.exit(1);
}

const stats = new Map();
function record(name, ms, status) {
  let s = stats.get(name);
  if (!s) stats.set(name, (s = { n: 0, err: 0, codes: {}, ms: [] }));
  s.n++;
  if (status >= 500 || status === 0 || status === 429) s.err++;
  s.codes[status] = (s.codes[status] || 0) + 1;
  s.ms.push(ms);
}
const pct = (arr, p) => (arr.length ? Math.round([...arr].sort((x, y) => x - y)[Math.min(arr.length - 1, Math.floor((p / 100) * arr.length))]) : 0);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const problems = [];
const check = (ok, msg) => {
  if (!ok) problems.push(msg);
  console.log(`  ${ok ? "✓" : "✗"} ${msg}`);
};

class Phone {
  constructor(email, name) {
    this.email = email;
    this.name = name;
    this.cookie = "";
    this.since = 0;
  }
  async call(name, method, path, body) {
    const t0 = performance.now();
    let status = 0, data = null;
    try {
      const res = await fetch(URL_ + "/api/" + path, { method, headers: { "content-type": "application/json", cookie: this.cookie, origin: URL_ }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30000) });
      status = res.status;
      for (const c of res.headers.getSetCookie?.() || []) if (c.startsWith("exs=")) this.cookie = c.split(";")[0];
      data = await res.json().catch(() => null);
    } catch {
      status = 0;
    }
    record(name, performance.now() - t0, status);
    return { status, data };
  }
}
async function pool(items, n, fn) {
  const q = [...items.entries()];
  await Promise.all(Array.from({ length: n }, async () => {
    for (let x; (x = q.shift());) await fn(x[1], x[0]);
  }));
}
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const NAMES = ["Çağrı", "Zofia", "Łukasz", "Ayşe", "Jürgen", "Inês", "Øyvind", "Şule", "Matteo", "Ana"];

const t0 = Date.now();
console.log(`Transfer bot test: ${USERS} delegates, ${BUSES} buses, ${STORM_S} s storm on ${URL_}\n`);

// ---------------------------------------------------------------- 1. accounts
const admin = new Phone(ADMIN_EMAIL, "Bus Admin");
let r = await admin.call("setup", "POST", "auth/register", { name: "Bus Admin", email: ADMIN_EMAIL, password: PASSWORD, kvkk: true, abroad: true });
if (r.status === 409) r = await admin.call("setup", "POST", "auth/login", { email: ADMIN_EMAIL, password: PASSWORD });
if (r.data?.user?.role !== "admin") throw new Error(`admin sign-in failed (${r.status}). Start the server with ADMIN_EMAILS=${ADMIN_EMAIL}.`);
await admin.call("setup", "POST", "admin/settings", { approval: false });
const bots = Array.from({ length: USERS }, (_, i) => new Phone(`bot-${i}@test.invalid`, `Bot ${NAMES[i % NAMES.length]} ${i}`));
console.log("1. Signing up bots…");
await pool(bots, 40, async (b, i) => {
  let x = await b.call("register", "POST", "auth/register", { name: b.name, email: b.email, password: PASSWORD, kvkk: true, abroad: true, lang: ["tr", "en", "pl"][i % 3], entity: pick(["AIESEC in Poland", "AIESEC in Türkiye", "AIESEC in Germany", "AIESEC in Italy"]) });
  if (x.status === 409) x = await b.call("login", "POST", "auth/login", { email: b.email, password: PASSWORD });
  b.id = x.data?.user?.id;
});
check(bots.every((b) => b.id), `${bots.filter((b) => b.id).length}/${USERS} bots signed in`);

// ---------------------------------------------------------------- 2. delegates add flights (some typos)
console.log("2. Bots enter their flights at the same time…");
const flights = new Map();
await Promise.all(bots.map(async (b, i) => {
  if (i % 2) return;
  const bad = i % 20 === 0;
  const f = { no: bad ? "not a flight!" : `${pick(["TK", "PC", "LO", "LH", "FR"])}${100 + (i % 900)}`, at: `2027-03-29T${String(8 + (i % 12)).padStart(2, "0")}:${i % 2 ? "30" : "05"}` };
  const x = await b.call("flight", "POST", "transfers/flight", f);
  if (bad) b.badFlightStatus = x.status;
  else if (x.status === 200) flights.set(b.id, x.data.flight);
}));
check(bots.filter((b, i) => i % 20 === 0).every((b) => b.badFlightStatus === 400), "wrong flight numbers are refused with 400");

// ---------------------------------------------------------------- 3. organizer pastes the list
console.log("3. Organizer pastes the bus list (e-mails, names, tabs/semicolons)…");
const busOf = new Map();
const lines = ["email\tbus\tflight\tlands"];
let seatN = 0;
bots.forEach((b, i) => {
  if (i % 10 === 9) return; // left without a bus on purpose
  const bus = `Otobüs ${1 + (seatN++ % BUSES)}`;
  busOf.set(b.id, bus);
  lines.push(i % 7 === 3 ? `${b.name.toUpperCase()};${bus}` : `${b.email}\t${bus}`);
});
lines.push("nobody@test.invalid\tOtobüs 1");
const imp = await admin.call("import", "POST", "transfers/import", { text: lines.join("\n") });
check(imp.status === 200, `import answered ${imp.status}`);
check(imp.data?.created === BUSES, `${imp.data?.created} buses created by name`);
check(imp.data?.assigned === busOf.size, `${imp.data?.assigned}/${busOf.size} delegates seated`);
check(imp.data?.missingCount === 1 && imp.data.missing[0] === "nobody@test.invalid", "unknown person reported back");

let view = (await admin.call("admin view", "GET", "transfers")).data;
const busByName = new Map(view.buses.map((b) => [b.name, b]));
await pool(view.buses, 8, (b, i) => admin.call("edit bus", "POST", "transfers/buses", { id: b.id, date: "2027-03-29", time: `${String(10 + (i % 10)).padStart(2, "0")}:00`, from: "Antalya Havalimanı T2", to: "Otel", meet: "Kapı 5", plate: `07 BUS ${100 + i}`, driver: "Şoför " + i, phone: "+90 532 000 00 " + String(10 + i).slice(-2), cap: 50 }));
const seatedIds = view.buses.flatMap((b) => b.passengers.map((p) => p.id));
check(new Set(seatedIds).size === seatedIds.length, "no one is on two buses after import");
check(view.buses.every((b) => b.passengers.every((p) => busOf.get(p.id) === b.name)), "everyone is on the bus from the list");
check(view.unassigned.filter((u) => u.email.startsWith("bot-")).length === USERS - busOf.size, `${USERS - busOf.size} bots correctly without a bus`);
check([...flights].every(([id, f]) => {
  const p = view.buses.flatMap((b) => b.passengers).concat(view.unassigned).find((x) => x.id === id);
  return p && p.flight?.no === f.no;
}), "organizer sees every flight the delegates entered");

// ---------------------------------------------------------------- 4. storm: phones polling while organizers work
console.log(`4. Storm: all bots polling while organizers move, board and change status for ${STORM_S} s…`);
let stop = false;
const seen = new Map();
const pollers = bots.map(async (b) => {
  await sleep(Math.random() * 3000);
  b.since = Date.now() - 1;
  let first = true;
  while (!stop) {
    const s = await b.call("sync", "GET", "sync?since=" + b.since);
    if (s.data?.now) b.since = s.data.now;
    if (first || s.data?.transfer) {
      if (!first) await sleep(Math.random() * 2500); // the app spreads reloads the same way
      first = false;
      const t = await b.call("delegate view", "GET", "transfers");
      if (t.status === 200) seen.set(b.id, t.data);
    }
    await sleep(2000 + Math.random() * 2000);
  }
});
// Organizers: board half of each bus, move some people, flip statuses, all concurrently.
const expectBoard = new Set();
const moves = [];
const seated = bots.filter((b) => busOf.has(b.id));
const orgJobs = [];
seated.forEach((b, i) => {
  if (i % 2 === 0) {
    expectBoard.add(b.id);
    orgJobs.push(() => admin.call("board", "POST", "transfers/board", { bus: busByName.get(busOf.get(b.id)).id, uid: b.id, on: true }));
  }
});
seated.slice(0, 40).forEach((b, i) => {
  if (i % 2 === 0) return; // only people not boarded get moved
  const to = `Otobüs ${1 + ((Number(busOf.get(b.id).split(" ")[1]) + 1) % BUSES)}`;
  moves.push([b.id, to]);
  orgJobs.push(() => admin.call("move", "POST", "transfers/assign", { uids: [b.id], bus: busByName.get(to).id }));
});
const unseated = bots.filter((b) => !busOf.has(b.id)).slice(0, 20);
unseated.forEach((b) => orgJobs.push(() => admin.call("assign", "POST", "transfers/assign", { uids: [b.id], bus: busByName.get("Otobüs 1").id })));
orgJobs.sort(() => Math.random() - 0.5);
const stormStart = Date.now();
// Three organizer phones in parallel, a little spread out over the storm.
await pool(orgJobs, 3, async (job) => {
  await job();
  await sleep(Math.random() * ((STORM_S * 600) / Math.max(1, orgJobs.length / 3)));
});
for (const [id, to] of moves) busOf.set(id, to);
for (const b of unseated) busOf.set(b.id, "Otobüs 1");
await pool(view.buses, 5, (b) => admin.call("status", "POST", "transfers/buses", { id: b.id, status: "boarding" }));
const finalStatus = "departed";
await pool(view.buses, 5, (b) => admin.call("status", "POST", "transfers/buses", { id: b.id, status: finalStatus }));
const left = STORM_S * 1000 - (Date.now() - stormStart);
await sleep(Math.max(left, 9000)); // let every phone run at least two polls after the last change
stop = true;
await Promise.all(pollers);

// ---------------------------------------------------------------- 5. checks
console.log("5. Checks");
view = (await admin.call("admin view", "GET", "transfers")).data;
const all = view.buses.flatMap((b) => b.passengers.map((p) => ({ ...p, bus: b.name })));
check(new Set(all.map((p) => p.id)).size === all.length, "still no one on two buses after concurrent moves");
check(all.filter((p) => p.email?.startsWith("bot-")).every((p) => busOf.get(p.id) === p.bus) && all.filter((p) => p.email?.startsWith("bot-")).length === busOf.size, `all ${busOf.size} seated bots are on the expected bus (moves and new seats applied)`);
const boardedNow = new Set(all.filter((p) => p.boarded).map((p) => p.id));
check([...expectBoard].every((id) => boardedNow.has(id)) && boardedNow.size === expectBoard.size, `${boardedNow.size}/${expectBoard.size} boarding ticks kept (none lost to parallel writes)`);
check(view.buses.every((b) => b.status === finalStatus), "every bus shows the last status");
let wrongBus = 0, staleStatus = 0, leak = 0, noView = 0;
for (const b of bots) {
  const d = seen.get(b.id);
  if (!d) {
    noView++;
    continue;
  }
  const mine = d.buses.find((x) => x.id === d.mine);
  if ((mine?.name || null) !== (busOf.get(b.id) || null)) wrongBus++;
  if (mine && mine.status !== finalStatus) staleStatus++;
  for (const x of d.buses) {
    if (x.id !== d.mine && (x.phone || x.driver)) leak++;
    if (x.passengers.some((p) => p.email || p.flight)) leak++;
  }
  if (d.unassigned) leak++;
}
check(noView === 0, `${USERS - noView}/${USERS} phones loaded the transfer screen`);
check(wrongBus === 0, `every phone shows its own bus at the end (${wrongBus} wrong)`);
check(staleStatus === 0, `every phone got the last status without reopening (${staleStatus} stale)`);
check(leak === 0, "no driver phone, e-mail or flight leaked to other delegates");
const forb = await Promise.all([bots[0].call("forbidden", "POST", "transfers/buses", { name: "Hack" }), bots[0].call("forbidden", "POST", "transfers/assign", { uids: [bots[1].id], bus: "" }), bots[0].call("forbidden", "POST", "transfers/board", { bus: view.buses[0].id, uid: bots[0].id, on: true }), bots[0].call("forbidden", "POST", "transfers/import", { text: "x" })]);
check(forb.every((x) => x.status === 403), "delegates get 403 on every organizer action");

// ---------------------------------------------------------------- report
const secs = (Date.now() - t0) / 1000;
console.log("\nroute               requests   errors   p50 ms   p95 ms   p99 ms   status codes");
for (const [name, s] of [...stats.entries()].filter(([k]) => k !== "setup").sort((a, b) => b[1].n - a[1].n))
  console.log(`${name.padEnd(20)}${String(s.n).padStart(8)}${String(s.err).padStart(9)}${String(pct(s.ms, 50)).padStart(9)}${String(pct(s.ms, 95)).padStart(9)}${String(pct(s.ms, 99)).padStart(9)}   ${JSON.stringify(s.codes)}`);
const errs = [...stats.values()].reduce((a, s) => a + s.err, 0);
console.log(`\n${Math.round(secs)} s, server errors/timeouts/429: ${errs}. ${problems.length ? "PROBLEMS:\n - " + problems.join("\n - ") : "All checks passed."}`);
process.exit(problems.length || errs ? 1 : 0);
