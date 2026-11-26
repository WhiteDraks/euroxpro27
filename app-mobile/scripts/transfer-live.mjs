#!/usr/bin/env node
// ============================================================
// Live transfer bot test: test-bot delegates sign up on a deployed app, enter
// flights and keep the app open (sync polling, transfer screen) while an
// organizer seats them on test buses, ticks boarding and changes statuses
// from /transfer/admin. At the end every bot reports what it sees and the
// run checks privacy and consistency. Bots only touch their own data.
//
//   node scripts/transfer-live.mjs --app https://app-mobile-murex.vercel.app --bots 35 --minutes 12
//
// Accounts are "Test Bot T<n>" / testbot-t<run>-<n>@test.invalid. If sign-up
// approval is on, an organizer approves them one by one; the bots wait.
// Delete them (and the test buses) from /admin afterwards.
// ============================================================
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return acc;
  }, [])
);
const APP = String(args.app || "").replace(/\/+$/, "");
const BOTS = Number(args.bots || 35);
const MINUTES = Number(args.minutes || 12);
const RUN = String(args.run || Date.now().toString(36)).slice(-6);
const PASSWORD = "bot-transfer-" + RUN + "-Kq7!";
if (!/^https:\/\//.test(APP)) {
  console.error("--app https://… is required");
  process.exit(1);
}
const ENTITIES = ["AIESEC in Türkiye", "AIESEC in Poland", "AIESEC in Germany", "AIESEC in Italy", "AIESEC in Spain", "AIESEC in Greece"];
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
const host = new URL(APP).host;

class Bot {
  constructor(i) {
    this.i = i;
    this.email = `testbot-t${RUN}-${i}@test.invalid`;
    this.name = `Test Bot T${i + 1}`;
    this.cookie = "";
    this.since = 0;
    this.history = []; // [time, bus name, status] whenever what it sees changes
  }
  async call(name, method, path, body) {
    const t0 = performance.now();
    let status = 0, data = null;
    try {
      const res = await fetch(APP + "/api/" + path, { method, headers: { "content-type": "application/json", cookie: this.cookie, origin: APP, "user-agent": "euroxpro-transfer-bot" }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30000) });
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

console.log(`Live transfer bots: ${BOTS} bots on ${host}, ${MINUTES} min, run ${RUN}`);
const bots = Array.from({ length: BOTS }, (_, i) => new Bot(i));
for (const b of bots) {
  let r = await b.call("register", "POST", "auth/register", { name: b.name, email: b.email, password: PASSWORD, entity: ENTITIES[b.i % ENTITIES.length], position: "LCP", lang: ["tr", "en", "pl"][b.i % 3], kvkk: true, abroad: true });
  if (r.status === 409) r = await b.call("login", "POST", "auth/login", { email: b.email, password: PASSWORD });
  b.status = r.data?.user?.status;
  b.id = r.data?.user?.id;
  await sleep(300);
}
console.log(`Signed up ${bots.filter((b) => b.id).length}/${BOTS}; status: ${JSON.stringify(bots.reduce((a, b) => ((a[b.status] = (a[b.status] || 0) + 1), a), {}))}`);
console.log("BOT_EMAILS " + bots.map((b) => b.email).join(","));

// Waiting for approval (if the setting is on): check every 15 s, up to 10 minutes.
const waitUntil = Date.now() + 10 * 60000;
while (bots.some((b) => b.status !== "active") && Date.now() < waitUntil) {
  await sleep(15000);
  for (const b of bots.filter((x) => x.status !== "active")) b.status = (await b.call("me", "GET", "me")).data?.user?.status;
  console.log(`  approved ${bots.filter((b) => b.status === "active").length}/${BOTS}`);
}
const live = bots.filter((b) => b.status === "active");

// Half of them enter a flight, as delegates would.
await Promise.all(live.filter((b) => b.i % 2 === 0).map((b) => b.call("flight", "POST", "transfers/flight", { no: ["TK", "LO", "LH", "PC"][b.i % 4] + (2400 + b.i), at: `2027-03-29T${String(9 + (b.i % 9)).padStart(2, "0")}:15` })));
const bad = await live[0]?.call("flight", "POST", "transfers/flight", { no: "<script>", at: "" });
console.log(`Flights entered; bad flight refused: ${bad?.status === 400}`);
console.log("READY_FOR_ORGANIZER " + new Date().toISOString());

const stopAt = Date.now() + MINUTES * 60000;
const describe = (d) => {
  const mine = d.buses.find((x) => x.id === d.mine);
  return mine ? `${mine.name}|${mine.status}` : "none";
};
await Promise.all(live.map(async (b) => {
  await sleep(Math.random() * 5000);
  b.since = Date.now() - 1;
  let first = true;
  while (Date.now() < stopAt) {
    const s = await b.call("sync", "GET", "sync?since=" + b.since);
    if (s.data?.now) b.since = s.data.now;
    if (first || s.data?.transfer) {
      if (!first) await sleep(Math.random() * 2500);
      first = false;
      const t = await b.call("transfers", "GET", "transfers");
      if (t.status === 200) {
        b.view = t.data;
        const now = describe(t.data);
        if (b.history.at(-1)?.[1] !== now) b.history.push([new Date().toISOString().slice(11, 19), now]);
      }
    }
    // The transfer screen is open: the app polls every 30 s (we use 8 s to see changes sooner).
    await sleep(6000 + Math.random() * 4000);
  }
  const t = await b.call("transfers", "GET", "transfers");
  if (t.status === 200) b.view = t.data;
}));

// ---------------------------------------------------------------- report
const problems = [];
let leaks = 0;
const byBus = new Map();
for (const b of live) {
  const d = b.view;
  if (!d) {
    problems.push(`${b.name}: no transfer view`);
    continue;
  }
  const mine = d.buses.find((x) => x.id === d.mine);
  const seenOn = d.buses.filter((x) => x.passengers.some((p) => p.id === b.id));
  if (seenOn.length > 1) problems.push(`${b.name} listed on ${seenOn.length} buses`);
  if (mine && !seenOn.includes(mine)) problems.push(`${b.name}: own bus doesn't list them`);
  for (const x of d.buses) {
    if (x.id !== d.mine && (x.phone || x.driver)) leaks++;
    if (x.passengers.some((p) => p.email || p.flight)) leaks++;
  }
  if (d.unassigned) leaks++;
  if (mine) byBus.set(mine.name, [...(byBus.get(mine.name) || []), { b, status: mine.status, count: mine.count, plate: mine.plate }]);
}
for (const [name, list] of byBus) {
  const st = new Set(list.map((x) => x.status));
  if (st.size > 1) problems.push(`${name}: bots disagree on status ${[...st]}`);
}
if (leaks) problems.push(`${leaks} privacy leaks`);
console.log("\nFINAL (bot -> bus|status; history)");
for (const b of live) console.log(`  ${b.name.padEnd(14)} ${b.view ? describe(b.view) : "?"}   ${b.history.map((h) => h.join(" ")).join(" → ")}`);
console.log("\nPer bus: " + [...byBus].map(([n, l]) => `${n}: ${l.length} bots, status ${l[0].status}, plate ${l[0].plate || "-"}`).join("; "));
console.log("\nroute          requests  errors  p50 ms  p95 ms  p99 ms  codes");
for (const [name, s] of [...stats].sort((a, b) => b[1].n - a[1].n))
  console.log(`${name.padEnd(14)}${String(s.n).padStart(9)}${String(s.err).padStart(8)}${String(pct(s.ms, 50)).padStart(8)}${String(pct(s.ms, 95)).padStart(8)}${String(pct(s.ms, 99)).padStart(8)}  ${JSON.stringify(s.codes)}`);
const errs = [...stats.values()].reduce((a, s) => a + s.err, 0);
console.log(`\nServer errors/timeouts/429: ${errs}. ${problems.length ? "PROBLEMS:\n - " + problems.join("\n - ") : "All checks passed."}`);
process.exit(problems.length || errs ? 1 : 0);
