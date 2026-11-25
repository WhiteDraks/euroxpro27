#!/usr/bin/env node
// ============================================================
// Live bot test: virtual delegates use the delegate app the way phones do,
// and virtual visitors browse the website, for a set time. Bots only talk
// to each other (DMs, Meet likes, QR cards), never in the general chat or
// to real people, so real users are not disturbed.
//
//   node scripts/bot-test.mjs --app https://app-mobile-murex.vercel.app \
//     --site https://euroxpro27.vercel.app --bots 35 --visitors 35 --minutes 20
//
// Bot accounts are "Test Bot <n>" / testbot-<run>-<n>@test.invalid. An
// organizer turns sign-up approval off while they register (or approves
// them), and deletes them afterwards from /admin.
// ============================================================

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return acc;
  }, [])
);
const APP = String(args.app || "").replace(/\/+$/, "");
const SITE = String(args.site || "").replace(/\/+$/, "");
const BOTS = Number(args.bots || 35);
const VISITORS = Number(args.visitors || 35);
const MINUTES = Number(args.minutes || 20);
const RUN = String(args.run || Date.now().toString(36));
const RAMP_S = Number(args.ramp || 60);
const PASSWORD = "bot-test-" + RUN + "-Kq7!";
const ENTITIES = ["AIESEC in Türkiye", "AIESEC in Poland", "AIESEC in Germany", "AIESEC in Italy", "AIESEC in Spain", "AIESEC in Romania", "AIESEC in Portugal", "AIESEC in Greece"];

const stats = new Map();
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (ms) => ms * (0.8 + Math.random() * 0.4);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
let stopAt = Date.now() + (MINUTES * 60 + RAMP_S) * 1000;

async function timed(name, url, opts = {}) {
  const t0 = performance.now();
  let status = 0, res = null;
  try {
    res = await fetch(url, { ...opts, signal: AbortSignal.timeout(30000) });
    status = res.status;
  } catch {
    status = 0;
  }
  return { res, status, done: (body) => (record(name, performance.now() - t0, status), body) };
}

// ------------------------------------------------------------ delegate app bots
class Bot {
  constructor(i) {
    this.i = i;
    this.cookie = "";
    this.since = 0;
    this.email = `testbot-${RUN}-${i}@test.invalid`;
  }
  async call(name, method, path, body) {
    const r = await timed("app " + name, APP + "/api/" + path, {
      method,
      headers: { "content-type": "application/json", cookie: this.cookie, origin: APP, "user-agent": "EuroxproBotTest/1" },
      body: body ? JSON.stringify(body) : undefined,
    });
    for (const c of r.res?.headers.getSetCookie?.() || []) {
      const kv = c.split(";")[0];
      if (kv.startsWith("exs=")) this.cookie = kv;
    }
    const data = r.res ? await r.res.json().catch(() => null) : null;
    r.done();
    return { status: r.status, data };
  }
}
const bots = [];
const botIds = new Set();

async function appBot(i) {
  const b = new Bot(i);
  bots.push(b);
  await sleep(Math.random() * RAMP_S * 1000);
  let r = await b.call("auth/register", "POST", "auth/register", {
    name: `Test Bot ${i + 1}`, email: b.email, password: PASSWORD, entity: ENTITIES[i % ENTITIES.length],
    lang: ["tr", "en", "pl"][i % 3], kvkk: true, abroad: true,
  });
  if (r.status === 409) r = await b.call("auth/login", "POST", "auth/login", { email: b.email, password: PASSWORD });
  if (r.status >= 400) return console.log(`bot ${i}: sign-up failed ${r.status} ${r.data?.error}`);
  b.id = r.data?.user?.id;
  botIds.add(b.id);
  // Wait (up to 6 min) until an organizer has let the account in.
  for (let k = 0; r.data?.user?.status !== "active" && k < 36; k++) {
    await sleep(10000);
    r = await b.call("me", "GET", "me");
  }
  if (r.data?.user?.status !== "active") return console.log(`bot ${i}: never approved`);
  b.active = true;
  // What the app loads on open.
  const [, ag] = await Promise.all([b.call("me", "GET", "me"), b.call("agenda", "GET", "agenda"), b.call("conversations", "GET", "conversations"), b.call("announcements", "GET", "announcements")]);
  const sessions = (ag.data?.agenda?.days || []).flatMap((d) => d.sessions.map((s) => s.id));
  b.since = Date.now();
  const chatty = i % 4 === 0;
  let next = { browse: Date.now() + jitter(45000), dm: Date.now() + jitter(60000), meet: Date.now() + jitter(90000), card: Date.now() + jitter(120000) };
  while (Date.now() < stopAt) {
    const s = await b.call("sync", "GET", "sync?since=" + b.since);
    if (s.data?.now) b.since = s.data.now;
    const now = Date.now();
    if (now > next.browse) {
      // Opens a screen the way people wander around the app.
      const screen = pick(["people", "team", "announcements", "plenary", "world", "quest", "store", "requests", "agenda", "contacts", "card", "approvals"]);
      await b.call(screen, "GET", screen);
      if (screen === "agenda" && sessions.length) await b.call("plan", "POST", "plan", { id: pick(sessions), on: Math.random() < 0.7 });
      next.browse = now + jitter(45000);
    }
    if (chatty && now > next.dm) {
      const peer = pick(bots.filter((x) => x !== b && x.active && x.id));
      if (peer) {
        const dm = await b.call("open dm", "POST", "conversations/dm", { userId: peer.id });
        if (dm.data?.id) {
          await b.call("dm messages", "GET", `conversations/${encodeURIComponent(dm.data.id)}/messages`);
          await b.call("send dm", "POST", `conversations/${encodeURIComponent(dm.data.id)}/messages`, { text: `Merhaba, ben test botu ${i + 1} (${new Date().toISOString().slice(11, 19)})` });
        }
      }
      next.dm = now + jitter(60000);
    }
    if (now > next.meet) {
      const deck = await b.call("meet/deck", "GET", "meet/deck");
      const other = (deck.data?.deck || []).find((x) => botIds.has(x.id));
      if (other) await b.call("meet/swipe", "POST", "meet/swipe", { userId: other.id, like: Math.random() < 0.6 });
      next.meet = now + jitter(120000);
    }
    if (now > next.card) {
      const peer = pick(bots.filter((x) => x !== b && x.active && x.cardTok));
      const mine = await b.call("card", "GET", "card");
      b.cardTok = mine.data?.token;
      if (peer) await b.call("contacts/scan", "POST", "contacts/scan", { token: peer.cardTok });
      next.card = now + jitter(240000);
    }
    await sleep(jitter(chatty ? 4000 : 30000));
  }
}

// ------------------------------------------------------------ website visitors
const PAGES = ["/", "/congress", "/explore-antalya", "/delegate-guide", "/faq", "/team", "/approvals", "/announcements", "/contact", "/merch"];
async function visitor(i) {
  await sleep(Math.random() * RAMP_S * 1000);
  const seenAssets = new Set();
  while (Date.now() < stopAt) {
    const page = pick(PAGES);
    const r = await timed("site page", SITE + page, { headers: { "user-agent": "EuroxproBotTest/1" } });
    const html = r.res ? await r.res.text().catch(() => "") : "";
    r.done();
    // Load the page's scripts, styles and images like a browser (cached after the first time).
    const assets = [...html.matchAll(/(?:src|href)="(\/_next\/(?:static|image)[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));
    for (const a of assets.slice(0, 12)) {
      if (seenAssets.has(a)) continue;
      seenAssets.add(a);
      const ar = await timed(a.includes("/_next/image") ? "site image" : "site asset", SITE + a);
      if (ar.res) await ar.res.arrayBuffer().catch(() => null);
      ar.done();
    }
    if (page === "/approvals") {
      const lr = await timed("site api/league", SITE + "/api/league");
      if (lr.res) await lr.res.text().catch(() => null);
      lr.done();
    }
    await sleep(jitter(20000));
  }
}

const started = Date.now();
console.log(`Bot test run ${RUN}: ${BOTS} app bots on ${APP || "-"}, ${VISITORS} visitors on ${SITE || "-"}, ${MINUTES} min`);
const ticker = setInterval(() => {
  const total = [...stats.values()].reduce((a, s) => a + s.n, 0);
  const errs = [...stats.values()].reduce((a, s) => a + s.err, 0);
  console.log(`${Math.round((Date.now() - started) / 1000)} s · ${total} requests · ${errs} errors · ${bots.filter((b) => b.active).length}/${BOTS} bots in`);
}, 30000);
await Promise.all([...(APP ? Array.from({ length: BOTS }, (_, i) => appBot(i)) : []), ...(SITE ? Array.from({ length: VISITORS }, (_, i) => visitor(i)) : [])]);
clearInterval(ticker);

const secs = (Date.now() - started) / 1000;
const rows = [...stats.entries()];
const total = rows.reduce((a, [, s]) => a + s.n, 0);
const errs = rows.reduce((a, [, s]) => a + s.err, 0);
console.log("\nroute                    requests   errors   p50 ms   p95 ms   p99 ms   status codes");
for (const [name, s] of rows.sort((a, b) => b[1].n - a[1].n))
  console.log(`${name.padEnd(25)}${String(s.n).padStart(8)}${String(s.err).padStart(9)}${String(pct(s.ms, 50)).padStart(9)}${String(pct(s.ms, 95)).padStart(9)}${String(pct(s.ms, 99)).padStart(9)}   ${JSON.stringify(s.codes)}`);
console.log(`\n${total} requests in ${Math.round(secs)} s = ${(total / secs).toFixed(1)} req/s, errors ${errs} (${((errs / Math.max(1, total)) * 100).toFixed(2)}%)`);
console.log(`BOT_IDS=${[...botIds].join(",")}`);
