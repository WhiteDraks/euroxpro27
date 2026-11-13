// ============================================================
// Delegate app API (served under /api/app/*).
// Accounts, live agenda, chat with automatic translation, and a cheap
// "sync" call the app polls for new messages and agenda changes
// (Vercel functions can't hold open connections between instances).
// ============================================================
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { after } from "next/server";
import seed from "./agenda-seed.json";
import { cmd, hashToObject, isConfigured, parse, pipe } from "./kv";
import { LANGS, isLang, peekMany, providerName, translate, type Lang } from "./translate";

type Role = "admin" | "delegate";
type User = { id: string; email: string; name: string; entity: string; lang: Lang; passHash: string; salt: string; role: Role; createdAt: number };
type Message = { id: string; conv: string; from: string; fromName: string; text: string; lang: Lang; at: number };
type Session = { id: string; start: string; end: string; title: string; type: string; location: string; description: string; status: string; note: string; noteLang?: string; dressCode?: string; updatedAt?: number } & Record<string, unknown>;
type Day = { day: number; date: string; label: string; sessions: Session[] } & Record<string, unknown>;
type Agenda = { published: boolean; draft: boolean; timezone: string; days: Day[] };
type Event = { at: number; type: "message" | "agenda"; conv?: string; msg?: Message; lang?: string; sessionId?: string };

class HttpError extends Error {
  constructor(public status: number, code: string) {
    super(code);
  }
}

const SESSION_DAYS = 30;
const GENERAL = "general";
const MAX_MESSAGE = 2000;
const EVENTS_KEPT = 300;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const adminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

// ------------------------------------------------------------ helpers

const newId = () => randomBytes(9).toString("base64url");
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return { hash: scryptSync(password, salt, 64).toString("hex"), salt };
}

function checkPassword(password: string, u: { passHash: string; salt: string }) {
  const { hash } = hashPassword(password, u.salt);
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(u.passHash, "hex"));
}

const DUMMY = hashPassword(randomBytes(12).toString("hex"));

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store", ...headers },
  });
}

const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);

function cookie(req: Request, name: string) {
  for (const part of (req.headers.get("cookie") || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

function sessionCookie(token: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `exs=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
}

async function limited(key: string, max: number, windowSec: number) {
  const n = (await cmd("INCR", "drl:" + key)) as number;
  if (n === 1) await cmd("EXPIRE", "drl:" + key, windowSec);
  return n > max;
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  const text = await req.text();
  if (text.length > 32 * 1024) throw new HttpError(413, "too_large");
  if (!text) return {};
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" ? v : {};
  } catch {
    throw new HttpError(400, "bad_json");
  }
}

const publicUser = (u: User) => ({ id: u.id, name: u.name, entity: u.entity || "", lang: u.lang, role: u.role });
const me = (u: User) => ({ ...publicUser(u), email: u.email });

async function getUser(id: string) {
  return parse<User>(await cmd("GET", "du:" + id));
}

async function saveUser(u: User) {
  await cmd("SET", "du:" + u.id, JSON.stringify(u));
}

async function currentUser(req: Request) {
  const token = cookie(req, "exs");
  if (!token) return null;
  const id = (await cmd("GET", "ds:" + sha256(token))) as string | null;
  return id ? getUser(id) : null;
}

async function startSession(u: User, status = 200) {
  const token = randomBytes(32).toString("base64url");
  await cmd("SET", "ds:" + sha256(token), u.id, "EX", SESSION_DAYS * 86400);
  return json({ user: me(u) }, status, { "set-cookie": sessionCookie(token, SESSION_DAYS * 86400) });
}

// ------------------------------------------------------------ chat

const dmId = (a: string, b: string) => "dm:" + [a, b].sort().join(":");

function canSee(u: User, conv: string) {
  if (conv === GENERAL) return true;
  const p = conv.split(":");
  return p[0] === "dm" && p.length === 3 && p.includes(u.id);
}

async function convPeer(u: User, conv: string) {
  if (conv === GENERAL) return null;
  const other = conv.split(":").slice(1).find((x) => x !== u.id) || u.id;
  return getUser(other);
}

// Messages as one reader sees them: translated into the reader's language.
async function forReader(u: User, msgs: Message[]) {
  const needs = msgs.map((m) => m.from !== u.id && m.lang !== u.lang);
  const cached = await peekMany(msgs.map((m, i) => ({ text: m.text, from: needs[i] ? m.lang : u.lang })), u.lang);
  return Promise.all(
    msgs.map(async (m, i) => {
      const base = { id: m.id, conv: m.conv, from: m.from, fromName: m.fromName, at: m.at, lang: m.lang, original: m.text };
      if (!needs[i]) return { ...base, text: m.text, translated: false };
      if (cached[i]) return { ...base, text: cached[i]!, translated: true };
      const r = await translate(m.text, m.lang, u.lang);
      return { ...base, text: r.text, translated: r.translated };
    })
  );
}

async function pushEvent(e: Event) {
  await pipe(["LPUSH", "dev", JSON.stringify(e)], ["LTRIM", "dev", 0, EVENTS_KEPT - 1], ["SET", "devat", e.at]);
}

// ------------------------------------------------------------ agenda

async function loadAgenda(): Promise<Agenda> {
  const a = parse<Agenda>(await cmd("GET", "dagenda"));
  if (a) return a;
  await cmd("SET", "dagenda", JSON.stringify(seed));
  return JSON.parse(JSON.stringify(seed));
}

// The agenda is written in English (organizer notes in the organizer's own
// language). Missing translations are fetched after the response is sent,
// then the app is told to reload the agenda, so opening it never waits.
async function agendaFor(lang: Lang) {
  const a = await loadAgenda();
  const fields: { obj: Record<string, unknown>; key: string; from: string }[] = [];
  for (const d of a.days) {
    fields.push({ obj: d, key: "label", from: "en" });
    for (const s of d.sessions) {
      fields.push({ obj: s, key: "title", from: "en" }, { obj: s, key: "description", from: "en" }, { obj: s, key: "location", from: "en" });
      if (s.note) fields.push({ obj: s, key: "note", from: s.noteLang || "en" });
    }
  }
  const items = fields.map((f) => ({ text: String(f.obj[f.key] || ""), from: f.from }));
  const hits = await peekMany(items, lang);
  const missing: typeof items = [];
  fields.forEach((f, i) => {
    const text = items[i].text;
    if (!text || f.from === lang) return;
    if (hits[i] != null) {
      f.obj[f.key + "Original"] = text;
      f.obj[f.key] = hits[i];
    } else missing.push(items[i]);
  });
  if (missing.length) {
    after(async () => {
      const sig = createHash("sha1").update(missing.map((m) => m.text).join("\u0000")).digest("base64url");
      const lock = `dlock:agenda:${lang}:${sig}`;
      const got = (await cmd("SET", lock, "1", "EX", 60, "NX")) as string | null;
      if (got !== "OK") return; // another request is already translating these
      const results = await Promise.all(missing.map((m) => translate(m.text, m.from, lang)));
      await cmd("DEL", lock);
      if (results.some((r) => r.translated)) await pushEvent({ at: Date.now(), type: "agenda", lang });
    });
  }
  return a;
}

// ------------------------------------------------------------ routes

type Ctx = { req: Request; url: URL; user: User | null; m: RegExpMatchArray };
type Handler = (c: Ctx) => Promise<Response> | Response;
const routes: { method: string; re: RegExp; open?: boolean; h: Handler }[] = [];
const route = (method: string, pattern: string, h: Handler, open = false) => routes.push({ method, re: new RegExp("^" + pattern + "$"), h, open });

route("GET", "health", () => json({ ok: true, storage: isConfigured, translator: providerName() }), true);

route(
  "POST",
  "auth/register",
  async ({ req }) => {
    if (await limited("reg:" + clientIp(req), 10, 3600)) throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    const name = clean(b.name, 60);
    const email = clean(b.email, 120).toLowerCase();
    const password = String(b.password || "");
    if (name.length < 2) throw new HttpError(400, "name_required");
    if (!EMAIL_RE.test(email)) throw new HttpError(400, "email_invalid");
    if (password.length < 8 || password.length > 200) throw new HttpError(400, "password_short");
    const id = newId();
    // SET NX on the e-mail key makes two parallel sign-ups with one address impossible.
    const claimed = await cmd("SET", "de:" + email, id, "NX");
    if (claimed !== "OK") throw new HttpError(409, "email_taken");
    const { hash, salt } = hashPassword(password);
    const user: User = {
      id,
      email,
      name,
      entity: clean(b.entity, 60),
      lang: isLang(b.lang) ? b.lang : "en",
      passHash: hash,
      salt,
      role: adminEmails().includes(email) ? "admin" : "delegate",
      createdAt: Date.now(),
    };
    const generalCount = (await cmd("LLEN", "dm:" + GENERAL)) as number;
    await pipe(
      ["SET", "du:" + id, JSON.stringify(user)],
      ["SADD", "dusers", id],
      ["HSET", "dr:" + id, GENERAL, generalCount] // no backlog of "unread" history
    );
    return startSession(user, 201);
  },
  true
);

route(
  "POST",
  "auth/login",
  async ({ req }) => {
    const b = await readJson(req);
    const email = clean(b.email, 120).toLowerCase();
    if ((await limited("login:" + clientIp(req), 30, 900)) || (await limited("login:" + email, 10, 900))) {
      throw new HttpError(429, "rate_limited");
    }
    const id = (await cmd("GET", "de:" + email)) as string | null;
    const user = id ? await getUser(id) : null;
    const ok = checkPassword(String(b.password || ""), user || { passHash: DUMMY.hash, salt: DUMMY.salt });
    if (!user || !ok) throw new HttpError(401, "bad_credentials");
    if (adminEmails().includes(user.email) && user.role !== "admin") {
      user.role = "admin";
      await saveUser(user);
    }
    return startSession(user);
  },
  true
);

route(
  "POST",
  "auth/logout",
  async ({ req }) => {
    const token = cookie(req, "exs");
    if (token) await cmd("DEL", "ds:" + sha256(token));
    return json({ ok: true }, 200, { "set-cookie": sessionCookie("", 0) });
  },
  true
);

route("GET", "me", ({ user }) => json({ user: me(user!) }));

route("PATCH", "me", async ({ req, user }) => {
  const u = user!;
  const b = await readJson(req);
  if (b.name !== undefined) {
    const name = clean(b.name, 60);
    if (name.length < 2) throw new HttpError(400, "name_required");
    u.name = name;
  }
  if (b.entity !== undefined) u.entity = clean(b.entity, 60);
  if (isLang(b.lang)) u.lang = b.lang;
  await saveUser(u);
  return json({ user: me(u) });
});

route("GET", "agenda", async ({ user }) => json({ agenda: await agendaFor(user!.lang) }));

route("PATCH", "agenda/sessions/([\\w-]+)", async ({ req, user, m }) => {
  if (user!.role !== "admin") throw new HttpError(403, "forbidden");
  const b = await readJson(req);
  const a = await loadAgenda();
  const s = a.days.flatMap((d) => d.sessions).find((x) => x.id === m[1]);
  if (!s) throw new HttpError(404, "not_found");
  if (b.status !== undefined) {
    if (!["scheduled", "delayed", "moved", "cancelled"].includes(String(b.status))) throw new HttpError(400, "bad_status");
    s.status = String(b.status);
  }
  for (const k of ["start", "end"] as const) {
    if (b[k] !== undefined) {
      if (!TIME_RE.test(String(b[k]))) throw new HttpError(400, "bad_time");
      s[k] = String(b[k]);
    }
  }
  if (b.location !== undefined) s.location = clean(b.location, 120);
  if (b.note !== undefined) {
    s.note = clean(b.note, 280);
    s.noteLang = user!.lang;
  }
  s.updatedAt = Date.now();
  await cmd("SET", "dagenda", JSON.stringify(a));
  await pushEvent({ at: s.updatedAt, type: "agenda", sessionId: s.id });
  return json({ ok: true });
});

route("GET", "people", async ({ user }) => {
  const ids = ((await cmd("SMEMBERS", "dusers")) as string[]).filter((x) => x !== user!.id);
  if (!ids.length) return json({ people: [] });
  const raw = (await cmd("MGET", ...ids.map((x) => "du:" + x))) as (string | null)[];
  const people = raw
    .map((r) => parse<User>(r))
    .filter((u): u is User => !!u)
    .map(publicUser)
    .sort((a, b) => a.name.localeCompare(b.name, user!.lang));
  return json({ people });
});

route("GET", "conversations", async ({ user }) => {
  const u = user!;
  const dms = (await cmd("SMEMBERS", "dconvs:" + u.id)) as string[];
  const convs = [GENERAL, ...dms];
  const res = await pipe(["HGETALL", "dr:" + u.id], ...convs.flatMap((c) => [["LLEN", "dm:" + c], ["LRANGE", "dm:" + c, -1, -1]]));
  const reads = hashToObject(res[0]);
  const rows = await Promise.all(
    convs.map(async (c, i) => {
      const count = res[1 + i * 2] as number;
      const last = parse<Message>((res[2 + i * 2] as string[])[0]);
      const peer = await convPeer(u, c);
      if (c !== GENERAL && !peer) return null;
      return {
        id: c,
        peer: peer ? publicUser(peer) : null,
        last: last ? (await forReader(u, [last]))[0] : null,
        unread: Math.max(0, count - Number(reads[c] || 0)),
      };
    })
  );
  const list = rows.filter((r) => r !== null);
  list.sort((a, b) => (a.id === GENERAL ? -1 : b.id === GENERAL ? 1 : (b.last?.at || 0) - (a.last?.at || 0)));
  return json({ conversations: list });
});

route("POST", "conversations/dm", async ({ req, user }) => {
  const b = await readJson(req);
  const peer = typeof b.userId === "string" ? await getUser(b.userId) : null;
  if (!peer || peer.id === user!.id) throw new HttpError(404, "not_found");
  return json({ id: dmId(user!.id, peer.id), peer: publicUser(peer) });
});

async function checkConv(u: User, conv: string) {
  if (!canSee(u, conv)) throw new HttpError(404, "not_found");
  const peer = await convPeer(u, conv);
  if (conv !== GENERAL && !peer) throw new HttpError(404, "not_found");
  return peer;
}

route("GET", "conversations/([\\w:-]+)/messages", async ({ user, m }) => {
  const peer = await checkConv(user!, m[1]);
  const raw = (await cmd("LRANGE", "dm:" + m[1], -60, -1)) as string[];
  const msgs = raw.map((r) => parse<Message>(r)).filter((x): x is Message => !!x);
  return json({ messages: await forReader(user!, msgs), peer: peer ? publicUser(peer) : null });
});

route("POST", "conversations/([\\w:-]+)/messages", async ({ req, user, m }) => {
  const u = user!;
  const conv = m[1];
  const peer = await checkConv(u, conv);
  if (await limited("msg:" + u.id, 30, 60)) throw new HttpError(429, "rate_limited");
  const b = await readJson(req);
  const text = clean(b.text, MAX_MESSAGE);
  if (!text) throw new HttpError(400, "empty");
  const msg: Message = { id: newId(), conv, from: u.id, fromName: u.name, text, lang: u.lang, at: Date.now() };
  const res = await pipe(
    ["RPUSH", "dm:" + conv, JSON.stringify(msg)],
    ...(conv !== GENERAL && peer ? [["SADD", "dconvs:" + u.id, conv], ["SADD", "dconvs:" + peer.id, conv]] : [])
  );
  await cmd("HSET", "dr:" + u.id, conv, res[0] as number);
  await pushEvent({ at: msg.at, type: "message", conv, msg });
  return json({ message: (await forReader(u, [msg]))[0] }, 201);
});

route("POST", "conversations/([\\w:-]+)/read", async ({ user, m }) => {
  await checkConv(user!, m[1]);
  const n = (await cmd("LLEN", "dm:" + m[1])) as number;
  await cmd("HSET", "dr:" + user!.id, m[1], n);
  return json({ ok: true });
});

// Polled by the app every few seconds. Costs one storage read when nothing changed.
route("GET", "sync", async ({ url, user }) => {
  const u = user!;
  const since = Number(url.searchParams.get("since")) || 0;
  const lastAt = Number(await cmd("GET", "devat")) || 0;
  if (!since || lastAt <= since) return json({ now: Math.max(lastAt, since || Date.now()), messages: [], agenda: false });
  const events = ((await cmd("LRANGE", "dev", 0, 99)) as string[])
    .map((r) => parse<Event>(r))
    .filter((e): e is Event => !!e && e.at > since)
    .reverse();
  const msgs = events.filter((e) => e.type === "message" && e.msg && canSee(u, e.msg.conv)).map((e) => e.msg!);
  const agenda = events.some((e) => e.type === "agenda" && (!e.lang || e.lang === u.lang));
  const agendaChange = events.some((e) => e.type === "agenda" && e.sessionId);
  return json({ now: lastAt, messages: await forReader(u, msgs), agenda, agendaChange });
});

// ------------------------------------------------------------ dispatcher

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") || req.headers.get("host"));
  } catch {
    return false;
  }
}

export async function handle(req: Request, segments: string[]) {
  try {
    if (req.method !== "GET" && !sameOrigin(req)) return json({ error: "bad_origin" }, 403);
    const path = segments.join("/");
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const m = path.match(r.re);
      if (!m) continue;
      if (!isConfigured && !r.open) return json({ error: "storage_missing" }, 503);
      const user = r.open ? null : await currentUser(req);
      if (!r.open && !user) return json({ error: "unauthorized" }, 401);
      return await r.h({ req, url: new URL(req.url), user, m });
    }
    return json({ error: "not_found" }, 404);
  } catch (err) {
    const e = err as Error & { status?: number };
    if (e instanceof HttpError || e.status) return json({ error: e.message }, e.status || 500);
    console.error("[delegate api]", err);
    return json({ error: "server_error" }, 500);
  }
}

export { LANGS };
