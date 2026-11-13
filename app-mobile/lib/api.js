// ============================================================
// Delegate app API (served under /api/app/*).
// Accounts, live agenda, chat with automatic translation, and a cheap
// "sync" call the app polls for new messages and agenda changes
// (Vercel functions can't hold open connections between instances).
// ============================================================
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import seed from "./agenda-seed.js";
import { cmd, hashToObject, isConfigured, parse, pipe } from "./kv.js";
import { LANGS, isLang, peekMany, providerName, translate } from "./translate.js";

// Run work after the response is sent. On Vercel the platform's request
// context keeps the function alive until it is done (same mechanism the
// @vercel/functions package uses); elsewhere the promise simply runs on.
function background(fn) {
    const p = fn().catch((e) => console.error("[delegate bg]", e));
    const ctx = globalThis[Symbol.for("@vercel/request-context")]?.get?.();
    ctx?.waitUntil?.(p);
}
class HttpError extends Error {
    status;
    constructor(status, code) {
        super(code);
        this.status = status;
    }
}
const SESSION_DAYS = 30;
const GENERAL = "general";
const MAX_MESSAGE = 2000;
const EVENTS_KEPT = 300;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const adminEmails = () => (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
// ------------------------------------------------------------ helpers
const newId = () => randomBytes(9).toString("base64url");
const sha256 = (s) => createHash("sha256").update(s).digest("hex");
function hashPassword(password, salt = randomBytes(16).toString("hex")) {
    return { hash: scryptSync(password, salt, 64).toString("hex"), salt };
}
function checkPassword(password, u) {
    const { hash } = hashPassword(password, u.salt);
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(u.passHash, "hex"));
}
const DUMMY = hashPassword(randomBytes(12).toString("hex"));
function json(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store", ...headers },
    });
}
const clean = (v, max) => String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
function cookie(req, name) {
    for (const part of (req.headers.get("cookie") || "").split(";")) {
        const i = part.indexOf("=");
        if (i > 0 && part.slice(0, i).trim() === name)
            return decodeURIComponent(part.slice(i + 1).trim());
    }
    return null;
}
function sessionCookie(token, maxAge) {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    return `exs=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
function clientIp(req) {
    return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
}
async function limited(key, max, windowSec) {
    const n = (await cmd("INCR", "drl:" + key));
    if (n === 1)
        await cmd("EXPIRE", "drl:" + key, windowSec);
    return n > max;
}
async function readJson(req) {
    const text = await req.text();
    if (text.length > 32 * 1024)
        throw new HttpError(413, "too_large");
    if (!text)
        return {};
    try {
        const v = JSON.parse(text);
        return v && typeof v === "object" ? v : {};
    }
    catch {
        throw new HttpError(400, "bad_json");
    }
}
// Small set of avatar emojis people can pick in their profile.
const EMOJIS = ["😀", "😎", "🤓", "🥳", "🤩", "😇", "🦊", "🐼", "🦁", "🐯", "🐬", "🦉", "🌞", "🌊", "🌴", "🍉", "☕", "🎧", "🎨", "⚽", "🚀", "🌍", "🌷", "🧿"];
// Delegate positions, as the 2024 app grouped people and agendas.
const POSITIONS = ["MCPc", "MCPe", "MCVP", "LCP", "LCVP", "Other"];
const publicUser = (u) => ({ id: u.id, name: u.name, entity: u.entity || "", lang: u.lang, role: u.role, emoji: u.emoji || "", position: u.position || "", title: u.role === "admin" ? u.title || "" : "" });
const me = (u) => ({ ...publicUser(u), email: u.email, bio: u.bio || "", meet: u.meet !== false });
async function getUser(id) {
    return parse(await cmd("GET", "du:" + id));
}
async function saveUser(u) {
    await cmd("SET", "du:" + u.id, JSON.stringify(u));
}
async function currentUser(req) {
    const token = cookie(req, "exs");
    if (!token)
        return null;
    const id = (await cmd("GET", "ds:" + sha256(token)));
    return id ? getUser(id) : null;
}
async function startSession(u, status = 200) {
    const token = randomBytes(32).toString("base64url");
    await cmd("SET", "ds:" + sha256(token), u.id, "EX", SESSION_DAYS * 86400);
    return json({ user: me(u) }, status, { "set-cookie": sessionCookie(token, SESSION_DAYS * 86400) });
}
// ------------------------------------------------------------ chat
const dmId = (a, b) => "dm:" + [a, b].sort().join(":");
function canSee(u, conv) {
    if (conv === GENERAL)
        return true;
    const p = conv.split(":");
    return p[0] === "dm" && p.length === 3 && p.includes(u.id);
}
async function convPeer(u, conv) {
    if (conv === GENERAL)
        return null;
    const other = conv.split(":").slice(1).find((x) => x !== u.id) || u.id;
    return getUser(other);
}
// Messages as one reader sees them: translated into the reader's language.
async function forReader(u, msgs) {
    const needs = msgs.map((m) => m.from !== u.id && m.lang !== u.lang);
    const cached = await peekMany(msgs.map((m, i) => ({ text: m.text, from: needs[i] ? m.lang : u.lang })), u.lang);
    return Promise.all(msgs.map(async (m, i) => {
        const base = { id: m.id, conv: m.conv, from: m.from, fromName: m.fromName, at: m.at, lang: m.lang, original: m.text };
        if (!needs[i])
            return { ...base, text: m.text, translated: false };
        if (cached[i])
            return { ...base, text: cached[i], translated: true };
        const r = await translate(m.text, m.lang, u.lang);
        return { ...base, text: r.text, translated: r.translated };
    }));
}
async function pushEvent(e) {
    await pipe(["LPUSH", "dev", JSON.stringify(e)], ["LTRIM", "dev", 0, EVENTS_KEPT - 1], ["SET", "devat", e.at]);
}
// ------------------------------------------------------------ agenda
async function loadAgenda() {
    const a = parse(await cmd("GET", "dagenda"));
    if (a)
        return a;
    await cmd("SET", "dagenda", JSON.stringify(seed));
    return JSON.parse(JSON.stringify(seed));
}
// The agenda is written in English (organizer notes in the organizer's own
// language). Missing translations are fetched after the response is sent,
// then the app is told to reload the agenda, so opening it never waits.
async function agendaFor(lang) {
    const a = await loadAgenda();
    const fields = [];
    for (const d of a.days) {
        fields.push({ obj: d, key: "label", from: "en" });
        for (const s of d.sessions) {
            fields.push({ obj: s, key: "title", from: "en" }, { obj: s, key: "description", from: "en" }, { obj: s, key: "location", from: "en" });
            if (s.note)
                fields.push({ obj: s, key: "note", from: s.noteLang || "en" });
        }
    }
    const items = fields.map((f) => ({ text: String(f.obj[f.key] || ""), from: f.from }));
    const hits = await peekMany(items, lang);
    const missing = [];
    fields.forEach((f, i) => {
        const text = items[i].text;
        if (!text || f.from === lang)
            return;
        if (hits[i] != null) {
            f.obj[f.key + "Original"] = text;
            f.obj[f.key] = hits[i];
        }
        else
            missing.push(items[i]);
    });
    if (missing.length) {
        background(async () => {
            const sig = createHash("sha1").update(missing.map((m) => m.text).join("\u0000")).digest("base64url");
            const lock = `dlock:agenda:${lang}:${sig}`;
            const got = (await cmd("SET", lock, "1", "EX", 60, "NX"));
            if (got !== "OK")
                return; // another request is already translating these
            const results = await Promise.all(missing.map((m) => translate(m.text, m.from, lang)));
            await cmd("DEL", lock);
            if (results.some((r) => r.translated))
                await pushEvent({ at: Date.now(), type: "agenda", lang });
        });
    }
    return a;
}
const routes = [];
const route = (method, pattern, h, open = false) => routes.push({ method, re: new RegExp("^" + pattern + "$"), h, open });
route("GET", "health", () => json({ ok: true, storage: isConfigured, translator: providerName() }), true);
route("POST", "auth/register", async ({ req }) => {
    if (await limited("reg:" + clientIp(req), 10, 3600))
        throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    const name = clean(b.name, 60);
    const email = clean(b.email, 120).toLowerCase();
    const password = String(b.password || "");
    if (name.length < 2)
        throw new HttpError(400, "name_required");
    if (!EMAIL_RE.test(email))
        throw new HttpError(400, "email_invalid");
    if (password.length < 8 || password.length > 200)
        throw new HttpError(400, "password_short");
    const id = newId();
    // SET NX on the e-mail key makes two parallel sign-ups with one address impossible.
    const claimed = await cmd("SET", "de:" + email, id, "NX");
    if (claimed !== "OK")
        throw new HttpError(409, "email_taken");
    const { hash, salt } = hashPassword(password);
    const user = {
        id,
        email,
        name,
        entity: clean(b.entity, 60),
        position: POSITIONS.includes(b.position) ? b.position : "",
        lang: isLang(b.lang) ? b.lang : "en",
        passHash: hash,
        salt,
        role: adminEmails().includes(email) ? "admin" : "delegate",
        createdAt: Date.now(),
    };
    const generalCount = (await cmd("LLEN", "dm:" + GENERAL));
    await pipe(["SET", "du:" + id, JSON.stringify(user)], ["SADD", "dusers", id], ["HSET", "dr:" + id, GENERAL, generalCount] // no backlog of "unread" history
    );
    return startSession(user, 201);
}, true);
route("POST", "auth/login", async ({ req }) => {
    const b = await readJson(req);
    const email = clean(b.email, 120).toLowerCase();
    if ((await limited("login:" + clientIp(req), 30, 900)) || (await limited("login:" + email, 10, 900))) {
        throw new HttpError(429, "rate_limited");
    }
    const id = (await cmd("GET", "de:" + email));
    const user = id ? await getUser(id) : null;
    const ok = checkPassword(String(b.password || ""), user || { passHash: DUMMY.hash, salt: DUMMY.salt });
    if (!user || !ok)
        throw new HttpError(401, "bad_credentials");
    if (adminEmails().includes(user.email) && user.role !== "admin") {
        user.role = "admin";
        await saveUser(user);
    }
    return startSession(user);
}, true);
route("POST", "auth/logout", async ({ req }) => {
    const token = cookie(req, "exs");
    if (token)
        await cmd("DEL", "ds:" + sha256(token));
    return json({ ok: true }, 200, { "set-cookie": sessionCookie("", 0) });
}, true);
route("GET", "me", ({ user }) => json({ user: me(user) }));
route("PATCH", "me", async ({ req, user }) => {
    const u = user;
    const b = await readJson(req);
    if (b.name !== undefined) {
        const name = clean(b.name, 60);
        if (name.length < 2)
            throw new HttpError(400, "name_required");
        u.name = name;
    }
    if (b.entity !== undefined)
        u.entity = clean(b.entity, 60);
    if (isLang(b.lang))
        u.lang = b.lang;
    if (b.emoji !== undefined)
        u.emoji = EMOJIS.includes(String(b.emoji)) ? String(b.emoji) : "";
    if (b.bio !== undefined) {
        u.bio = clean(b.bio, 160);
        u.bioLang = u.lang;
    }
    if (b.meet !== undefined)
        u.meet = Boolean(b.meet);
    if (b.position !== undefined)
        u.position = POSITIONS.includes(b.position) ? b.position : "";
    if (b.title !== undefined && u.role === "admin")
        u.title = clean(b.title, 40);
    await saveUser(u);
    return json({ user: me(u) });
});
route("GET", "agenda", async ({ user }) => json({ agenda: await agendaFor(user.lang) }));
route("PATCH", "agenda/sessions/([\\w-]+)", async ({ req, user, m }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const b = await readJson(req);
    const a = await loadAgenda();
    const s = a.days.flatMap((d) => d.sessions).find((x) => x.id === m[1]);
    if (!s)
        throw new HttpError(404, "not_found");
    if (b.status !== undefined) {
        if (!["scheduled", "delayed", "moved", "cancelled"].includes(String(b.status)))
            throw new HttpError(400, "bad_status");
        s.status = String(b.status);
    }
    for (const k of ["start", "end"]) {
        if (b[k] !== undefined) {
            if (!TIME_RE.test(String(b[k])))
                throw new HttpError(400, "bad_time");
            s[k] = String(b[k]);
        }
    }
    if (b.location !== undefined)
        s.location = clean(b.location, 120);
    if (Array.isArray(b.audience))
        s.audience = POSITIONS.filter((p) => b.audience.includes(p));
    if (b.note !== undefined) {
        s.note = clean(b.note, 280);
        s.noteLang = user.lang;
    }
    s.updatedAt = Date.now();
    await cmd("SET", "dagenda", JSON.stringify(a));
    await pushEvent({ at: s.updatedAt, type: "agenda", sessionId: s.id });
    return json({ ok: true });
});
route("GET", "people", async ({ user }) => {
    const ids = (await cmd("SMEMBERS", "dusers")).filter((x) => x !== user.id);
    if (!ids.length)
        return json({ people: [] });
    const raw = (await cmd("MGET", ...ids.map((x) => "du:" + x)));
    const people = raw
        .map((r) => parse(r))
        .filter((u) => !!u)
        .map(publicUser)
        .sort((a, b) => a.name.localeCompare(b.name, user.lang));
    return json({ people });
});
route("GET", "conversations", async ({ user }) => {
    const u = user;
    const dms = (await cmd("SMEMBERS", "dconvs:" + u.id));
    const convs = [GENERAL, ...dms];
    const res = await pipe(["HGETALL", "dr:" + u.id], ...convs.flatMap((c) => [["LLEN", "dm:" + c], ["LRANGE", "dm:" + c, -1, -1]]));
    const reads = hashToObject(res[0]);
    const rows = await Promise.all(convs.map(async (c, i) => {
        const count = res[1 + i * 2];
        const last = parse(res[2 + i * 2][0]);
        const peer = await convPeer(u, c);
        if (c !== GENERAL && !peer)
            return null;
        return {
            id: c,
            peer: peer ? publicUser(peer) : null,
            last: last ? (await forReader(u, [last]))[0] : null,
            unread: Math.max(0, count - Number(reads[c] || 0)),
        };
    }));
    const list = rows.filter((r) => r !== null);
    list.sort((a, b) => (a.id === GENERAL ? -1 : b.id === GENERAL ? 1 : (b.last?.at || 0) - (a.last?.at || 0)));
    return json({ conversations: list });
});
route("POST", "conversations/dm", async ({ req, user }) => {
    const b = await readJson(req);
    const peer = typeof b.userId === "string" ? await getUser(b.userId) : null;
    if (!peer || peer.id === user.id)
        throw new HttpError(404, "not_found");
    return json({ id: dmId(user.id, peer.id), peer: publicUser(peer) });
});
async function checkConv(u, conv) {
    if (!canSee(u, conv))
        throw new HttpError(404, "not_found");
    const peer = await convPeer(u, conv);
    if (conv !== GENERAL && !peer)
        throw new HttpError(404, "not_found");
    return peer;
}
route("GET", "conversations/([\\w:-]+)/messages", async ({ user, m }) => {
    const peer = await checkConv(user, m[1]);
    const raw = (await cmd("LRANGE", "dm:" + m[1], -60, -1));
    const msgs = raw.map((r) => parse(r)).filter((x) => !!x);
    return json({ messages: await forReader(user, msgs), peer: peer ? publicUser(peer) : null });
});
route("POST", "conversations/([\\w:-]+)/messages", async ({ req, user, m }) => {
    const u = user;
    const conv = m[1];
    const peer = await checkConv(u, conv);
    if (await limited("msg:" + u.id, 30, 60))
        throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    const text = clean(b.text, MAX_MESSAGE);
    if (!text)
        throw new HttpError(400, "empty");
    const msg = { id: newId(), conv, from: u.id, fromName: u.name, text, lang: u.lang, at: Date.now() };
    const res = await pipe(["RPUSH", "dm:" + conv, JSON.stringify(msg)], ...(conv !== GENERAL && peer ? [["SADD", "dconvs:" + u.id, conv], ["SADD", "dconvs:" + peer.id, conv]] : []));
    await cmd("HSET", "dr:" + u.id, conv, res[0]);
    await pushEvent({ at: msg.at, type: "message", conv, msg });
    return json({ message: (await forReader(u, [msg]))[0] }, 201);
});
route("POST", "conversations/([\\w:-]+)/read", async ({ user, m }) => {
    await checkConv(user, m[1]);
    const n = (await cmd("LLEN", "dm:" + m[1]));
    await cmd("HSET", "dr:" + user.id, m[1], n);
    return json({ ok: true });
});
// Polled by the app every few seconds. Costs one storage read when nothing changed.
route("GET", "sync", async ({ url, user }) => {
    const u = user;
    const since = Number(url.searchParams.get("since")) || 0;
    // Presence for the plenary hall rides along with the poll (same round trip).
    const [rawLast] = await pipe(["GET", "devat"], ["ZADD", "dpres", Date.now(), u.id]);
    const lastAt = Number(rawLast) || 0;
    if (!since || lastAt <= since)
        return json({ now: Math.max(lastAt, since || Date.now()), messages: [], agenda: false, matches: [], announce: false, request: false });
    const events = (await cmd("LRANGE", "dev", 0, 99))
        .map((r) => parse(r))
        .filter((e) => !!e && e.at > since)
        .reverse();
    const msgs = events.filter((e) => e.type === "message" && e.msg && canSee(u, e.msg.conv)).map((e) => e.msg);
    const agenda = events.some((e) => e.type === "agenda" && (!e.lang || e.lang === u.lang));
    const agendaChange = events.some((e) => e.type === "agenda" && e.sessionId);
    const matches = events.filter((e) => e.type === "match" && e.users?.includes(u.id)).map((e) => e.users.find((x) => x !== u.id));
    const matchUsers = (await Promise.all(matches.map(getUser))).filter(Boolean).map(publicUser);
    const announce = events.some((e) => e.type === "announce");
    // Organizers hear about new requests; the sender hears about replies.
    const request = events.some((e) => e.type === "request" && (e.to === u.id || (e.to === "admins" && u.role === "admin")));
    return json({ now: lastAt, messages: await forReader(u, msgs), agenda, agendaChange, matches: matchUsers, announce, request });
});
// ------------------------------------------------------------ meet (swipe to get to know people)
async function usersByIds(ids) {
    if (!ids.length)
        return [];
    const raw = await cmd("MGET", ...ids.map((x) => "du:" + x));
    return raw.map((r) => parse(r)).filter(Boolean);
}
async function withBio(reader, users) {
    const bios = await peekMany(users.map((x) => ({ text: x.bio || "", from: x.bioLang || x.lang })), reader.lang);
    return Promise.all(users.map(async (x, i) => {
        const out = { ...publicUser(x), bio: x.bio || "", bioTranslated: false };
        const from = x.bioLang || x.lang;
        if (!x.bio || from === reader.lang)
            return out;
        const tr = bios[i] != null ? { text: bios[i], translated: true } : await translate(x.bio, from, reader.lang);
        return { ...out, bio: tr.text, bioOriginal: x.bio, bioTranslated: tr.translated };
    }));
}
route("GET", "meet/deck", async ({ user }) => {
    const u = user;
    const [all, swiped] = await pipe(["SMEMBERS", "dusers"], ["SMEMBERS", "dsw:" + u.id]);
    const seen = new Set(swiped);
    const ids = all.filter((x) => x !== u.id && !seen.has(x));
    // Shuffle, then take a small batch.
    for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    const users = (await usersByIds(ids.slice(0, 40))).filter((x) => x.meet !== false).slice(0, 15);
    return json({ deck: await withBio(u, users) });
});
route("GET", "meet/matches", async ({ user }) => {
    const ids = await cmd("SMEMBERS", "dmatch:" + user.id);
    const users = (await usersByIds(ids)).map(publicUser);
    return json({ matches: users.map((p) => ({ ...p, conv: dmId(user.id, p.id) })) });
});
route("POST", "meet/swipe", async ({ req, user }) => {
    const u = user;
    const b = await readJson(req);
    const target = typeof b.userId === "string" ? await getUser(b.userId) : null;
    if (!target || target.id === u.id)
        throw new HttpError(404, "not_found");
    if (await limited("swipe:" + u.id, 120, 60))
        throw new HttpError(429, "rate_limited");
    const like = Boolean(b.like);
    const res = await pipe(["SADD", "dsw:" + u.id, target.id], ...(like ? [["SADD", "dlk:" + u.id, target.id], ["SISMEMBER", "dlk:" + target.id, u.id]] : []));
    const match = like && res[2] === 1;
    if (match) {
        await pipe(["SADD", "dmatch:" + u.id, target.id], ["SADD", "dmatch:" + target.id, u.id]);
        await pushEvent({ at: Date.now(), type: "match", users: [u.id, target.id] });
    }
    return json({ match, peer: match ? publicUser(target) : null, conv: match ? dmId(u.id, target.id) : null });
});
// ------------------------------------------------------------ plenary hall (who is in the app right now)
const ONLINE_MS = 30000;
route("GET", "plenary", async ({ user }) => {
    const now = Date.now();
    const [, , ids] = await pipe(["ZADD", "dpres", now, user.id], ["ZREMRANGEBYSCORE", "dpres", "-inf", now - 10 * 60000], ["ZRANGEBYSCORE", "dpres", now - ONLINE_MS, "+inf"]);
    if (!ids.includes(user.id))
        ids.push(user.id);
    const people = (await usersByIds(ids.slice(-150))).map(publicUser);
    return json({ people });
});
// ------------------------------------------------------------ directory and congress team
async function allUsers() {
    const ids = await cmd("SMEMBERS", "dusers");
    return usersByIds(ids);
}
route("GET", "people/([\\w-]+)", async ({ user, m }) => {
    const p = await getUser(m[1]);
    if (!p)
        throw new HttpError(404, "not_found");
    const [out] = await withBio(user, [p]);
    return json({ person: out });
});
route("GET", "team", async ({ user }) => {
    const team = (await allUsers())
        .filter((x) => x.role === "admin")
        .map(publicUser)
        .sort((a, b) => (a.title || "~").localeCompare(b.title || "~") || a.name.localeCompare(b.name, user.lang));
    return json({ team });
});
// ------------------------------------------------------------ announcements (organizers post, everyone reads, translated)
const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
async function loadAnnouncements() {
    return (await cmd("LRANGE", "dann", 0, 99)).map((r) => parse(r)).filter(Boolean);
}
async function translatedFields(reader, items, keys) {
    const flat = [];
    for (const it of items)
        for (const k of keys)
            flat.push({ it, k, text: it[k] || "", from: it.lang || "en" });
    const hits = await peekMany(flat.map((f) => ({ text: f.text, from: f.from })), reader.lang);
    await Promise.all(flat.map(async (f, i) => {
        if (!f.text || f.from === reader.lang)
            return;
        const tr = hits[i] != null ? { text: hits[i], translated: true } : await translate(f.text, f.from, reader.lang);
        if (tr.translated) {
            f.it[f.k + "Original"] = f.text;
            f.it[f.k] = tr.text;
        }
    }));
    return items;
}
route("GET", "announcements", async ({ user }) => {
    const list = await loadAnnouncements();
    return json({ announcements: await translatedFields(user, list, ["title", "body"]) });
});
route("POST", "announcements", async ({ req, user }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const b = await readJson(req);
    const title = clean(b.title, 120);
    if (!title)
        throw new HttpError(400, "title_required");
    const deadline = DATETIME_RE.test(String(b.deadline || "")) ? String(b.deadline) : "";
    const a = { id: newId(), title, body: clean(b.body, 1000), deadline, lang: user.lang, by: user.name, at: Date.now() };
    await pipe(["LPUSH", "dann", JSON.stringify(a)], ["LTRIM", "dann", 0, 99]);
    await pushEvent({ at: a.at, type: "announce" });
    return json({ announcement: a }, 201);
});
route("POST", "announcements/([\\w-]+)/delete", async ({ user, m }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const list = await loadAnnouncements();
    const keep = list.filter((a) => a.id !== m[1]);
    await pipe(["DEL", "dann"], ...(keep.length ? [["RPUSH", "dann", ...keep.map((a) => JSON.stringify(a))]] : []));
    await pushEvent({ at: Date.now(), type: "announce" });
    return json({ ok: true });
});
// ------------------------------------------------------------ requests and complaints (delegate -> organizers)
const REQ_KINDS = ["request", "complaint", "lost"];
route("GET", "requests", async ({ user }) => {
    const ids = await cmd("LRANGE", "dqids", 0, 499);
    const all = ids.length ? (await cmd("MGET", ...ids.map((x) => "dq:" + x))).map((r) => parse(r)).filter(Boolean) : [];
    const mine = user.role === "admin" ? all : all.filter((q) => q.uid === user.id);
    // Each reader sees text in their language: the request for organizers, the reply for the sender.
    await translatedFields(user, mine.filter((q) => q.uid !== user.id), ["text"]);
    const replies = mine.filter((q) => q.reply).map((q) => ({ q, reply: q.reply, lang: q.replyLang || q.lang }));
    await translatedFields(user, replies, ["reply"]);
    for (const r of replies)
        if (r.replyOriginal)
            Object.assign(r.q, { reply: r.reply, replyOriginal: r.replyOriginal });
    return json({ requests: mine });
});
route("POST", "requests", async ({ req, user }) => {
    if (await limited("req:" + user.id, 10, 3600))
        throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    const text = clean(b.text, 1000);
    if (text.length < 3)
        throw new HttpError(400, "text_required");
    const q = { id: newId(), uid: user.id, name: user.name, entity: user.entity || "", kind: REQ_KINDS.includes(b.kind) ? b.kind : "request", text, lang: user.lang, at: Date.now(), status: "open", reply: "" };
    await pipe(["SET", "dq:" + q.id, JSON.stringify(q)], ["LPUSH", "dqids", q.id], ["LTRIM", "dqids", 0, 499]);
    await pushEvent({ at: q.at, type: "request", to: "admins" });
    return json({ request: q }, 201);
});
route("POST", "requests/([\\w-]+)", async ({ req, user, m }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const q = parse(await cmd("GET", "dq:" + m[1]));
    if (!q)
        throw new HttpError(404, "not_found");
    const b = await readJson(req);
    if (["open", "done"].includes(b.status))
        q.status = b.status;
    if (b.reply !== undefined) {
        q.reply = clean(b.reply, 1000);
        q.replyLang = user.lang;
        q.replyBy = user.name;
    }
    q.updatedAt = Date.now();
    await cmd("SET", "dq:" + q.id, JSON.stringify(q));
    await pushEvent({ at: q.updatedAt, type: "request", to: q.uid });
    return json({ request: q });
});
// ------------------------------------------------------------ dispatcher
function sameOrigin(req) {
    const origin = req.headers.get("origin");
    if (!origin)
        return true;
    try {
        return new URL(origin).host === (req.headers.get("x-forwarded-host") || req.headers.get("host"));
    }
    catch {
        return false;
    }
}
export async function handle(req, segments) {
    try {
        if (req.method !== "GET" && !sameOrigin(req))
            return json({ error: "bad_origin" }, 403);
        const path = segments.join("/");
        for (const r of routes) {
            if (r.method !== req.method)
                continue;
            const m = path.match(r.re);
            if (!m)
                continue;
            if (!isConfigured && !r.open)
                return json({ error: "storage_missing" }, 503);
            const user = r.open ? null : await currentUser(req);
            if (!r.open && !user)
                return json({ error: "unauthorized" }, 401);
            return await r.h({ req, url: new URL(req.url), user, m });
        }
        return json({ error: "not_found" }, 404);
    }
    catch (err) {
        const e = err;
        if (e instanceof HttpError || e.status)
            return json({ error: e.message }, e.status || 500);
        console.error("[delegate api]", err);
        return json({ error: "server_error" }, 500);
    }
}
export { LANGS };
