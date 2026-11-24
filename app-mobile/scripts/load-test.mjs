#!/usr/bin/env node
// ============================================================
// Load test for the delegate app: many virtual delegates using the app the
// way phones do (sync polling, chats, agenda, the plenary hall), with
// latency and error numbers at the end. No packages, Node 20+.
//
// Local run (safe, in-memory storage):
//   ADMIN_EMAILS=load-admin@test.invalid ADMIN_2FA=off node dev-server.js
//   node scripts/load-test.mjs --users 1000 --minutes 3
//
// Against a deployed copy (creates real accounts, costs requests):
//   node scripts/load-test.mjs --url https://<preview>.vercel.app --users 300 --minutes 5 --yes-really
// Use a preview deployment with its own Upstash database, never the live
// app during the congress. Accounts are named loadtest-<n>@test.invalid.
// ============================================================

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return acc;
  }, [])
);
const URL_ = String(args.url || "http://localhost:3000").replace(/\/+$/, "");
const USERS = Number(args.users || 200);
const MINUTES = Number(args.minutes || 2);
const CHATTY = Number(args.chatty || 0.1); // share of people sitting in an open chat
// --lite turns on the organizer's load mode for the run.
const RAMP_S = Number(args.ramp || 60); // everyone arrives within this many seconds
const ADMIN_EMAIL = String(args["admin-email"] || "load-admin@test.invalid");
const PASSWORD = "load-test-password";

if (!/^http:\/\/(localhost|127\.0\.0\.1)/.test(URL_) && !args["yes-really"]) {
  console.error(`Refusing to load-test ${URL_} without --yes-really (it creates accounts and costs requests).`);
  process.exit(1);
}

// ------------------------------------------------------------ stats
const stats = new Map();
let inflight = 0;
function record(name, ms, status) {
  let s = stats.get(name);
  if (!s) stats.set(name, (s = { n: 0, err: 0, codes: {}, ms: [] }));
  s.n++;
  if (status >= 400 || status === 0) s.err++;
  s.codes[status] = (s.codes[status] || 0) + 1;
  s.ms.push(ms);
}
const pct = (arr, p) => {
  if (!arr.length) return 0;
  const a = [...arr].sort((x, y) => x - y);
  return Math.round(a[Math.min(a.length - 1, Math.floor((p / 100) * a.length))]);
};

class Phone {
  constructor(i) {
    this.i = i;
    this.cookie = "";
    this.since = 0;
  }
  async call(name, method, path, body) {
    const t0 = performance.now();
    inflight++;
    let status = 0, data = null;
    try {
      const res = await fetch(URL_ + "/api/" + path, {
        method,
        headers: { "content-type": "application/json", cookie: this.cookie, origin: URL_ },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(30000),
      });
      status = res.status;
      for (const c of res.headers.getSetCookie?.() || []) {
        const kv = c.split(";")[0];
        if (kv.startsWith("exs=")) this.cookie = kv;
      }
      data = await res.json().catch(() => null);
    } catch {
      status = 0;
    }
    inflight--;
    record(name, performance.now() - t0, status);
    return { status, data };
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (ms) => ms * (0.85 + Math.random() * 0.3);
let stopAt = 0;

async function prepare() {
  const admin = new Phone(-1);
  let r = await admin.call("setup", "POST", "auth/register", { name: "Load Admin", email: ADMIN_EMAIL, password: PASSWORD, kvkk: true, abroad: true });
  if (r.status === 409) r = await admin.call("setup", "POST", "auth/login", { email: ADMIN_EMAIL, password: PASSWORD });
  if (r.status >= 400) throw new Error(`admin sign-in failed (${r.status} ${r.data?.error}). Start the server with ADMIN_EMAILS=${ADMIN_EMAIL} ADMIN_2FA=off.`);
  r = await admin.call("setup", "POST", "admin/settings", { approval: false, lite: !!args.lite });
  if (r.status >= 400) throw new Error(`can't turn approval off (${r.status} ${r.data?.error})`);
  return admin;
}

async function delegate(i) {
  const p = new Phone(i);
  await sleep(Math.random() * RAMP_S * 1000);
  const email = `loadtest-${i}@test.invalid`;
  // New account on the first run, sign-in on later runs.
  let r = await p.call("auth/register", "POST", "auth/register", { name: `Load ${i}`, email, password: PASSWORD, kvkk: true, abroad: true, lang: ["tr", "en", "pl"][i % 3] });
  if (r.status === 409) r = await p.call("auth/login", "POST", "auth/login", { email, password: PASSWORD });
  if (r.status >= 400) return;
  // What the app loads on open.
  await Promise.all([p.call("me", "GET", "me"), p.call("agenda", "GET", "agenda"), p.call("conversations", "GET", "conversations")]);
  p.since = Date.now();
  const chatty = Math.random() < CHATTY;
  const inHall = !chatty && Math.random() < 0.2;
  let nextMsg = Date.now() + jitter(60000);
  let nextHall = Date.now();
  while (Date.now() < stopAt) {
    const s = await p.call("sync", "GET", "sync?since=" + p.since);
    if (s.data?.now) p.since = s.data.now;
    const lite = s.data?.lite === true;
    if (chatty && Date.now() > nextMsg) {
      await p.call("send message", "POST", "conversations/general/messages", { text: `Hello from ${i} at ${new Date().toISOString().slice(11, 19)}` });
      nextMsg = Date.now() + jitter(60000);
    }
    if (inHall && Date.now() > nextHall) {
      await p.call("plenary", "GET", "plenary");
      nextHall = Date.now() + (lite ? 60000 : 15000);
    }
    await sleep(jitter(chatty ? (lite ? 10000 : 4000) : lite ? 60000 : 30000));
  }
}

const started = Date.now();
console.log(`Load test: ${USERS} delegates on ${URL_} for ${MINUTES} min (ramp ${RAMP_S} s, ${Math.round(CHATTY * 100)}% in chats)`);
await prepare();
stopAt = Date.now() + MINUTES * 60000;
const ticker = setInterval(() => {
  const total = [...stats.values()].reduce((a, s) => a + s.n, 0);
  process.stdout.write(`\r  ${Math.round((Date.now() - started) / 1000)} s · ${total} requests · ${inflight} in flight   `);
}, 2000);
await Promise.all(Array.from({ length: USERS }, (_, i) => delegate(i)));
clearInterval(ticker);

const secs = (Date.now() - started) / 1000;
const rows = [...stats.entries()].filter(([k]) => k !== "setup");
const total = rows.reduce((a, [, s]) => a + s.n, 0);
const errs = rows.reduce((a, [, s]) => a + s.err, 0);
console.log("\n\nroute               requests   errors   p50 ms   p95 ms   p99 ms   status codes");
for (const [name, s] of rows.sort((a, b) => b[1].n - a[1].n))
  console.log(`${name.padEnd(20)}${String(s.n).padStart(8)}${String(s.err).padStart(9)}${String(pct(s.ms, 50)).padStart(9)}${String(pct(s.ms, 95)).padStart(9)}${String(pct(s.ms, 99)).padStart(9)}   ${JSON.stringify(s.codes)}`);
console.log(`\n${total} requests in ${Math.round(secs)} s = ${(total / secs).toFixed(1)} req/s, errors ${errs} (${((errs / Math.max(1, total)) * 100).toFixed(2)}%)`);
const syncs = stats.get("sync")?.n || 0;
console.log(`Steady state: ${(syncs / Math.max(1, secs - RAMP_S / 2)).toFixed(1)} syncs/s for ${USERS} phones -> about ${Math.round((syncs / Math.max(1, secs - RAMP_S / 2)) * 3600)} requests per hour.`);
process.exit(errs / Math.max(1, total) > 0.01 ? 1 : 0);
