// ============================================================
// Delegate app API (served under /api/app/*).
// Accounts, live agenda, chat with automatic translation, and a cheap
// "sync" call the app polls for new messages and agenda changes
// (Vercel functions can't hold open connections between instances).
// ============================================================
import { createHash, randomBytes, scrypt, scryptSync, timingSafeEqual } from "crypto";
import { promisify } from "util";
import seed from "./agenda-seed.js";
import { countryOf } from "../public/countries.js";
import { cmd, hashToObject, isConfigured, parse, pipe } from "./kv.js";
import { LANGS, isLang, peekMany, providerName, translate } from "./translate.js";
import { approvalEnabled, provider as mailProvider, sendApprovedEmail, sendMail, sendSignupDigest, sendSignupEmail, signupRecipients } from "./mail.js";
import { hasSubscription, publicKey, pushers, removeSubscription, saveSubscription, sendToUser, validSubscription } from "./push.js";
import { checkTotp, newTotpSecret, otpauthUrl, turnstileSiteKey, verifyTurnstile } from "./security.js";

// Run work after the response is sent. On Vercel the platform's request
// context keeps the function alive until it is done (same mechanism the
// @vercel/functions package uses); elsewhere the promise simply runs on.
function background(fn) {
    const p = fn().catch((e) => console.error("[delegate bg]", e));
    const ctx = globalThis[Symbol.for("@vercel/request-context")]?.get?.();
    ctx?.waitUntil?.(p);
}
// Small per-instance cache for answers everyone shares (user lists, the
// quest board, the world map). A warm function instance serves a crowd from
// memory for a few seconds instead of reading storage on every request.
const memo = new Map();
function cached(key, ms, fn) {
    const hit = memo.get(key);
    if (hit && Date.now() - hit.at < ms)
        return hit.p;
    const p = fn();
    memo.set(key, { at: Date.now(), p });
    p.catch(() => memo.delete(key));
    return p;
}
const forget = (...keys) => keys.forEach((k) => memo.delete(k));
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
// Same hash as hashPassword, but off the main thread, so a burst of sign-ins
// doesn't stall every other request on the same function instance.
const scryptAsync = promisify(scrypt);
async function hashPasswordAsync(password, salt = randomBytes(16).toString("hex")) {
    return { hash: (await scryptAsync(password, salt, 64)).toString("hex"), salt };
}
async function checkPassword(password, u) {
    const { hash } = await hashPasswordAsync(password, u.salt);
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
    // Vercel sets x-real-ip itself; it is not taken from the client.
    return (req.headers.get("x-real-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0]).trim() || "local";
}
// Per-IP limits for sign-up (per hour) and sign-in (per 15 min). Generous
// because a venue's Wi-Fi puts hundreds of phones behind one address;
// raise them on Vercel if the whole congress shares one connection.
const IP_LIMIT = { register: Number(process.env.RATE_IP_REGISTER) || 500, login: Number(process.env.RATE_IP_LOGIN) || 500 };
async function limited(key, max, windowSec) {
    const n = (await cmd("INCR", "drl:" + key));
    if (n === 1)
        await cmd("EXPIRE", "drl:" + key, windowSec);
    return n > max;
}
// E-mail goes out through a provider with a daily free quota (Resend 100,
// Gmail 500), so the app keeps its own count and stops a little before it.
async function mailQuota(n) {
    const kind = mailProvider();
    if (!kind || n <= 0)
        return 0;
    const max = Number(process.env.MAIL_DAILY_MAX) || (kind === "smtp" ? 450 : 95);
    const key = "dmail:" + new Date().toISOString().slice(0, 10);
    const used = Number(await cmd("INCRBY", key, n));
    if (used === n)
        await cmd("EXPIRE", key, 2 * 86400);
    return Math.max(0, Math.min(n, max - (used - n)));
}
const appAddress = (req) => (process.env.APP_URL || pushSubject(req)).replace(/\/+$/, "");
// "Your account is approved" e-mails, a few at a time, within the quota.
async function mailApproved(users, appUrl) {
    if (!approvalEnabled())
        return;
    const list = users.filter((u) => !u.demo && u.email);
    const allowed = await mailQuota(list.length);
    if (allowed < list.length)
        console.warn(`[delegate mail] approval e-mails over the daily limit: ${list.length - allowed} skipped`);
    const queue = list.slice(0, allowed);
    const worker = async () => {
        for (let u; (u = queue.shift());)
            await sendApprovedEmail(u, appUrl).catch((e) => console.error("[delegate mail]", e.message));
    };
    await Promise.all(Array.from({ length: Math.min(4, queue.length) }, worker));
}
const DIGEST_SEC = 900;
async function flushSignupDigest(appUrl) {
    if ((await cmd("SET", "dsignlock", "1", "EX", DIGEST_SEC, "NX")) !== "OK")
        return;
    const [ids] = await pipe(["LRANGE", "dsignq", 0, 199], ["DEL", "dsignq"]);
    const users = await usersByIds(ids || []);
    if (!users.length) {
        await cmd("DEL", "dsignlock"); // nothing sent: the next sign-up may e-mail at once
        return;
    }
    if (!(await mailQuota(1)))
        return console.warn(`[delegate mail] daily limit reached: sign-up e-mail for ${users.length} skipped`);
    await (users.length === 1 ? sendSignupEmail(users[0], appUrl) : sendSignupDigest(users, appUrl, ids.length)).catch((e) => console.error("[delegate mail]", e.message));
}
// Sign-ups that arrived during the quiet 15 minutes go out from here (called
// by syncs, at most once a minute per instance, and by the health check).
let digestCheckedAt = 0;
function maybeFlushDigest(req) {
    if (Date.now() - digestCheckedAt < 60000)
        return;
    digestCheckedAt = Date.now();
    const appUrl = appAddress(req);
    background(async () => {
        if (Number(await cmd("LLEN", "dsignq")) > 0)
            await flushSignupDigest(appUrl);
    });
}
async function readJson(req, max = 32 * 1024) {
    const text = await req.text();
    if (text.length > max)
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
const publicUser = (u) => ({ id: u.id, name: u.name, entity: u.entity || "", lang: u.lang, role: u.role, emoji: u.emoji || "", photo: u.photoV ? `/api/photo/${u.id}?v=${u.photoV}` : "", position: u.position || "", title: u.role === "admin" ? u.title || "" : "" });
const me = (u) => ({ ...publicUser(u), email: u.email, bio: u.bio || "", meet: u.meet !== false, status: statusOf(u), twofa: !!u.totp, twofaSetup: needsTwofaSetup(u) });
// Account status. Accounts made before sign-up approval existed have no
// status and count as active. Organizers are always active.
const STATUSES = ["pending", "active", "suspended", "rejected"];
const statusOf = (u) => (u.role === "admin" ? "active" : STATUSES.includes(u.status) ? u.status : "active");
const isActive = (u) => statusOf(u) === "active";
// Who other delegates can see in lists, Meet, the hall and the map.
const listed = (u) => !!u && isActive(u) && !(u.demo && !demoOn());
const isOwner = (u) => adminEmails().includes(String(u.email || "").toLowerCase());
// lite: "load mode" for crowded moments. Phones poll less often, the hall
// refreshes slower and messages that aren't translated yet arrive in the
// original language (no wait on the translator).
const SETTINGS_DEFAULT = { approval: true, signups: true, lite: false };
// Keep in step with KVKK_VERSION in public/kvkk.js.
const KVKK_VERSION = "2026-11-22";
async function loadSettings() {
    return { ...SETTINGS_DEFAULT, ...(parse(await cmd("GET", "dset")) || {}) };
}
// Read on every sync, so shared per instance for 5 s.
const settingsNow = () => cached("settings", 5000, loadSettings);
const liteNow = async () => (await settingsNow().catch(() => SETTINGS_DEFAULT)).lite === true;
// Organizer accounts need a 6-digit code from an authenticator app. ADMIN_2FA=off
// is the escape hatch if every organizer lost their phone.
const twofaEnforced = () => !/^(off|0|false|no)$/i.test(String(process.env.ADMIN_2FA || "").trim());
const needsTwofaSetup = (u) => u.role === "admin" && !u.totp && twofaEnforced();
// True once per install: the first ADMIN_EMAILS sign-up, when no organizer exists yet.
async function bootstrapOwner(id) {
    if ((await cmd("SET", "downer", id, "NX")) !== "OK")
        return false;
    return !(await allUsers()).some((x) => x.role === "admin");
}
function needAdmin(u) {
    if (u.role !== "admin")
        throw new HttpError(403, "forbidden");
}
async function getUser(id) {
    return parse(await cmd("GET", "du:" + id));
}
async function saveUser(u) {
    await cmd("SET", "du:" + u.id, JSON.stringify(u));
    forget("listed", "hall", "world", "qboard");
}
// Session token -> "<id>.<version>", kept per instance for a minute so each
// poll costs one storage read less. The user record is still read fresh on
// every request, so a password reset or suspension takes effect at once.
const SESSION_MEMO_MS = 60000;
const sessions = new Map();
async function currentUser(req) {
    const token = cookie(req, "exs");
    if (!token)
        return null;
    const key = sha256(token);
    const hit = sessions.get(key);
    let v = hit && Date.now() - hit.at < SESSION_MEMO_MS ? hit.v : null;
    if (!v) {
        v = (await cmd("GET", "ds:" + key));
        if (!v)
            return null;
        if (sessions.size > 20000)
            sessions.clear();
        sessions.set(key, { v, at: Date.now() });
    }
    // "<id>.<session version>": a new password bumps the version, so every
    // session opened with the old one stops working at once.
    const [id, ver = "0"] = String(v).split(".");
    const u = await getUser(id);
    // A signed-out session can still sit in another instance's memo for up
    // to a minute; the user record (read fresh anyway) lists it until then.
    if (u?.rev?.some((r) => r.k === key.slice(0, 16)))
        return null;
    return u && String(u.sv || 0) === ver ? u : null;
}
async function startSession(u, status = 200, extraCookies = []) {
    const token = randomBytes(32).toString("base64url");
    await cmd("SET", "ds:" + sha256(token), `${u.id}.${u.sv || 0}`, "EX", SESSION_DAYS * 86400);
    const res = json({ user: me(u) }, status, { "set-cookie": sessionCookie(token, SESSION_DAYS * 86400) });
    for (const c of extraCookies)
        res.headers.append("set-cookie", c);
    return res;
}
// "Known device": a long-lived random cookie set at each successful sign-in.
// Wrong-password slowdowns for an e-mail address don't apply to a device
// that already signed in to that account, so nobody can lock a delegate
// out just by knowing their e-mail.
const DEVICE_DAYS = 365;
function deviceCookie(req, u) {
    let token = cookie(req, "exd");
    if (!token || !/^[\w-]{20,64}$/.test(token))
        token = randomBytes(24).toString("base64url");
    const hash = sha256(token).slice(0, 32);
    u.devices = [hash, ...(u.devices || []).filter((x) => x !== hash)].slice(0, 10);
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    return `exd=${token}; Path=/api/auth; HttpOnly; SameSite=Lax; Max-Age=${DEVICE_DAYS * 86400}${secure}`;
}
function knownDevice(req, u) {
    const token = cookie(req, "exd");
    return !!token && !!u?.devices?.includes(sha256(token).slice(0, 32));
}
// Wrong passwords (or codes) for one e-mail: the first 5 are free, then each
// try from an unknown device waits 15 s, 30 s, 1 min ... up to 5 min.
const FREE_FAILS = 5;
const failKey = (email) => "dlf:" + sha256(email).slice(0, 32);
async function loginWait(email) {
    const f = parse(await cmd("GET", failKey(email)));
    return f && f.until > Date.now() ? Math.ceil((f.until - Date.now()) / 1000) : 0;
}
async function loginFailed(email) {
    const f = parse(await cmd("GET", failKey(email))) || { n: 0, until: 0 };
    f.n += 1;
    if (f.n >= FREE_FAILS)
        f.until = Date.now() + Math.min(300, 15 * 2 ** (f.n - FREE_FAILS)) * 1000;
    await cmd("SET", failKey(email), JSON.stringify(f), "EX", 3600);
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
            return { ...base, text: cached[i], translated: cached[i] !== m.text };
        if (await liteNow())
            return { ...base, text: m.text, translated: false };
        const r = await translate(m.text, m.lang, u.lang);
        return { ...base, text: r.text, translated: r.translated };
    }));
}
async function pushEvent(e) {
    await pipe(["LPUSH", "dev", JSON.stringify(e)], ["LTRIM", "dev", 0, EVENTS_KEPT - 1], ["SET", "devat", e.at]);
    lastEvent = { v: 0, at: 0 };
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
        if (hits[i] != null && hits[i] !== text) {
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
// What the sign-up form needs before it is sent (the bot check's public key).
route("GET", "auth/config", () => json({ turnstile: turnstileSiteKey() || null }, 200, { "cache-control": "public, max-age=300" }), true);
route("POST", "auth/register", async ({ req }) => {
    // Per IP, generous: a whole venue on one Wi-Fi (or a mobile carrier) shares an address.
    if (await limited("reg:" + clientIp(req), IP_LIMIT.register, 3600))
        throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    // Bots: a hidden field people never see (bots fill every box), then
    // Cloudflare Turnstile once its keys are set on Vercel.
    if (b.website)
        throw new HttpError(400, "captcha_failed");
    if (!(await verifyTurnstile(b.captcha, clientIp(req))))
        throw new HttpError(400, "captcha_failed");
    const name = clean(b.name, 60);
    const email = clean(b.email, 120).toLowerCase();
    const password = String(b.password || "");
    if (name.length < 2)
        throw new HttpError(400, "name_required");
    if (!EMAIL_RE.test(email))
        throw new HttpError(400, "email_invalid");
    if (password.length < 8 || password.length > 200)
        throw new HttpError(400, "password_short");
    // KVKK: no account without the privacy notice acknowledged and explicit
    // consent to the transfer abroad (hosting, database, translation).
    if (b.kvkk !== true)
        throw new HttpError(400, "kvkk_required");
    if (b.abroad !== true)
        throw new HttpError(400, "abroad_required");
    const ownerEmail = adminEmails().includes(email);
    const settings = await loadSettings();
    if (!settings.signups && !ownerEmail)
        throw new HttpError(403, "signups_closed");
    const id = newId();
    // SET NX on the e-mail key makes two parallel sign-ups with one address impossible.
    const claimed = await cmd("SET", "de:" + email, id, "NX");
    if (claimed !== "OK")
        throw new HttpError(409, "email_taken");
    // E-mail addresses are not verified, so anyone could sign up with an
    // ADMIN_EMAILS address nobody has used yet. Only the very first organizer
    // of a fresh install becomes one straight away; after that, such an
    // account waits like everyone else, and an organizer has to approve it
    // before the address gives organizer rights (see auth/login).
    const owner = ownerEmail && (await bootstrapOwner(id));
    const { hash, salt } = await hashPasswordAsync(password);
    const user = {
        id,
        email,
        name,
        entity: clean(b.entity, 60),
        position: POSITIONS.includes(b.position) ? b.position : "",
        lang: isLang(b.lang) ? b.lang : "en",
        passHash: hash,
        salt,
        role: owner ? "admin" : "delegate",
        // ADMIN_EMAILS addresses always wait for an organizer, even with approval off.
        status: owner || (!settings.approval && !ownerEmail) ? "active" : "pending",
        createdAt: Date.now(),
        // Proof of consent: which notice version, and when.
        consent: { v: KVKK_VERSION, kvkkAt: Date.now(), abroadAt: Date.now() },
    };
    const generalCount = (await cmd("LLEN", "dm:" + GENERAL));
    await pipe(["SET", "du:" + id, JSON.stringify(user)], ["SADD", "dusers", id], ["HSET", "dr:" + id, GENERAL, generalCount] // no backlog of "unread" history
    );
    await pushEvent({ at: Date.now(), type: "signup", pending: user.status === "pending" });
    countStat("signup");
    if (user.status === "pending") {
        // Tell the organizers someone is waiting for them.
        const subject = pushSubject(req);
        background(async () => {
            const admins = (await allUsers()).filter((x) => x.role === "admin").map((x) => x.id);
            if (admins.length)
                await notify("messages", subject, (p) => ({ title: pt(p, "signup"), body: pt(p, "signupBody", { n: user.name + (user.entity ? ` · ${user.entity}` : "") }), url: "/admin", tag: "signup" }), admins);
        });
    }
    // E-mail the organizers too (lib/mail.js); best-effort, never blocks
    // sign-up. At most one e-mail per 15 minutes: later sign-ups are
    // gathered into one summary, so a burst of fake accounts can't use up the
    // daily e-mail quota that approval e-mails need.
    const appUrl = appAddress(req);
    background(async () => {
        await cmd("RPUSH", "dsignq", user.id);
        await flushSignupDigest(appUrl);
    });
    return startSession(user, 201);
}, true);
route("POST", "auth/login", async ({ req }) => {
    const b = await readJson(req);
    const email = clean(b.email, 120).toLowerCase();
    if (await limited("login:" + clientIp(req), IP_LIMIT.login, 900))
        throw new HttpError(429, "rate_limited");
    const id = (await cmd("GET", "de:" + email));
    const user = id ? await getUser(id) : null;
    const known = knownDevice(req, user);
    if (!known) {
        const wait = await loginWait(email);
        if (wait)
            return json({ error: "login_wait", wait }, 429, { "retry-after": String(wait) });
    }
    const ok = await checkPassword(String(b.password || ""), user || { passHash: DUMMY.hash, salt: DUMMY.salt });
    if (!user || !ok) {
        if (!known)
            await loginFailed(email);
        throw new HttpError(401, "bad_credentials");
    }
    // Two-step sign-in: the password was right, now the 6-digit code.
    if (user.totp) {
        if (!b.code)
            throw new HttpError(401, "code_required");
        const step = checkTotp(user.totp, b.code, user.totpLast || 0);
        if (!step) {
            if (!known)
                await loginFailed(email);
            throw new HttpError(401, "bad_code");
        }
        user.totpLast = step; // the same code can't be used twice
    }
    await cmd("DEL", failKey(email));
    // Only an account an organizer has approved: an unverified sign-up with
    // an ADMIN_EMAILS address must not promote itself.
    if (adminEmails().includes(user.email) && user.role !== "admin" && isActive(user))
        user.role = "admin";
    const dev = deviceCookie(req, user);
    await saveUser(user);
    return startSession(user, 200, [dev]);
}, true);
route("POST", "auth/logout", async ({ req }) => {
    const token = cookie(req, "exs");
    if (token) {
        const key = sha256(token);
        sessions.delete(key);
        const v = await cmd("GET", "ds:" + key);
        await cmd("DEL", "ds:" + key);
        // Other instances may still remember this session for a minute.
        const u = v ? await getUser(String(v).split(".")[0]) : null;
        if (u) {
            u.rev = [{ k: key.slice(0, 16), at: Date.now() }, ...(u.rev || []).filter((r) => Date.now() - r.at < 2 * SESSION_MEMO_MS)].slice(0, 20);
            await saveUser(u);
        }
    }
    return json({ ok: true }, 200, { "set-cookie": sessionCookie("", 0) });
}, true);
// Sign out every other phone and computer; this device gets a fresh session.
route("POST", "auth/logout-all", async ({ user }) => {
    user.sv = (user.sv || 0) + 1;
    user.rev = [];
    await saveUser(user);
    return startSession(user);
}, "any");
// ------------------------------------------------------------ two-step sign-in (TOTP)
route("POST", "me/2fa/setup", async ({ user }) => {
    if (user.totp)
        throw new HttpError(409, "twofa_on");
    const secret = newTotpSecret();
    user.totpPending = { s: secret, at: Date.now() };
    await saveUser(user);
    return json({ secret, url: otpauthUrl(secret, user.email) });
}, "any");
route("POST", "me/2fa/enable", async ({ req, user }) => {
    if (await limited("2fa:" + user.id, 10, 300))
        throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    const p = user.totpPending;
    if (!p || Date.now() - p.at > 30 * 60000)
        throw new HttpError(400, "twofa_expired");
    const step = checkTotp(p.s, b.code);
    if (!step)
        throw new HttpError(400, "bad_code");
    user.totp = p.s;
    user.totpLast = step;
    delete user.totpPending;
    // Anyone else signed in to this account is signed out now.
    user.sv = (user.sv || 0) + 1;
    user.rev = [];
    await saveUser(user);
    return startSession(user);
}, "any");
route("POST", "me/2fa/disable", async ({ req, user }) => {
    if (user.role === "admin" && twofaEnforced())
        throw new HttpError(403, "twofa_mandatory");
    if (await limited("2fa:" + user.id, 10, 300))
        throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    if (!user.totp || !checkTotp(user.totp, b.code, user.totpLast || 0))
        throw new HttpError(400, "bad_code");
    delete user.totp;
    delete user.totpLast;
    await saveUser(user);
    return json({ user: me(user) });
}, "any");
route("GET", "me", ({ user }) => json({ user: me(user) }), "any");
route("PATCH", "me", async ({ req, user }) => {
    const u = user;
    const b = await readJson(req, 400 * 1024);
    if (b.photo !== undefined) {
        // The app sends a small square JPEG (resized on the phone) as a data URL.
        if (b.photo === "") {
            await cmd("DEL", "dph:" + u.id);
            u.photoV = 0;
        }
        else {
            const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(String(b.photo));
            const buf = m ? Buffer.from(m[1], "base64") : null;
            if (!buf || buf.length > 250 * 1024 || buf[0] !== 0xff || buf[1] !== 0xd8)
                throw new HttpError(400, "bad_photo");
            await cmd("SET", "dph:" + u.id, m[1]);
            u.photoV = Date.now();
        }
    }
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
}, "any");
route("GET", "agenda", async ({ user }) => json({ agenda: await agendaFor(user.lang) }));
route("PATCH", "agenda/sessions/([\\w-]+)", async ({ req, user, m }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const b = await readJson(req);
    const a = await loadAgenda();
    const day = a.days.find((d) => d.sessions.some((x) => x.id === m[1]));
    const s = day?.sessions.find((x) => x.id === m[1]);
    if (!s)
        throw new HttpError(404, "not_found");
    const before = { status: s.status || "scheduled", start: s.start, location: s.location };
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
    // Tell the people in this session when its status, time or room changed,
    // unless it is already over.
    const status = s.status || "scheduled";
    const changed = status !== before.status || s.start !== before.start || s.location !== before.location;
    if (changed && sessionStart(day, s) + 3600000 > Date.now()) {
        const subject = pushSubject(req);
        background(() => notify("changes", subject, async (u) => {
            if (!forPosition(s, u.position))
                return null;
            const parts = [];
            if (status !== before.status)
                parts.push(pt(u, status));
            if (s.start !== before.start)
                parts.push(pt(u, "newTime", { t: s.start }));
            if (s.location !== before.location)
                parts.push(pt(u, "newPlace", { l: await tr(s.location, "en", u) }));
            if (s.note)
                parts.push(await tr(s.note, s.noteLang || "en", u));
            return { title: `${pt(u, "changed")}: ${short(await tr(s.title, "en", u), 70)}`, body: short(parts.join(" · ")), url: "/agenda/" + s.id, tag: "c-" + s.id };
        }));
    }
    return json({ ok: true });
});
// Everyone visible to delegates, read at most every 20 s per instance:
// the directory, the team page and the world map all start from it.
const USERS_MEMO_MS = 20000;
const listedUsers = () => cached("listed", USERS_MEMO_MS, async () => (await allUsers()).filter(listed));
route("GET", "people", async ({ user }) => {
    const people = (await listedUsers())
        .filter((x) => x.id !== user.id)
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
    // All chat partners in one storage read instead of one read per chat.
    const peerIds = dms.map((c) => c.split(":").slice(1).find((x) => x !== u.id) || u.id);
    const peers = new Map((await usersByIds(peerIds)).map((p) => [p.id, p]));
    const rows = await Promise.all(convs.map(async (c, i) => {
        const count = res[1 + i * 2];
        const last = parse(res[2 + i * 2][0]);
        const peer = c === GENERAL ? null : peers.get(peerIds[i - 1]) || null;
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
    if (!peer || peer.id === user.id || (!listed(peer) && user.role !== "admin"))
        throw new HttpError(404, "not_found");
    if (blockedBy(user).has(peer.id))
        throw new HttpError(403, "blocked");
    return json({ id: dmId(user.id, peer.id), peer: publicUser(peer) });
});
async function checkConv(u, conv) {
    if (!canSee(u, conv))
        throw new HttpError(404, "not_found");
    const peer = await convPeer(u, conv);
    // One conversation per pair: "dm:<b>:<a>" would open a second thread
    // that skips the checks below.
    if (conv !== GENERAL && (!peer || conv !== dmId(u.id, peer.id)))
        throw new HttpError(404, "not_found");
    return peer;
}
route("GET", "conversations/([\\w:-]+)/messages", async ({ user, m }) => {
    const peer = await checkConv(user, m[1]);
    const raw = (await cmd("LRANGE", "dm:" + m[1], -60, -1));
    const blocked = blockedBy(user);
    const msgs = raw.map((r) => parse(r)).filter((x) => !!x && !blocked.has(x.from));
    return json({ messages: await forReader(user, msgs), peer: peer ? publicUser(peer) : null, blocked: !peer ? false : (user.blocked || []).includes(peer.id) ? "you" : (user.blockedBy || []).includes(peer.id) ? "them" : false });
});
route("POST", "conversations/([\\w:-]+)/messages", async ({ req, user, m }) => {
    const u = user;
    const conv = m[1];
    const peer = await checkConv(u, conv);
    // No new messages to waiting, suspended or removed accounts (organizers may).
    if (peer && peer.id !== u.id && !listed(peer) && u.role !== "admin")
        throw new HttpError(404, "not_found");
    if (peer && blockedBy(u).has(peer.id))
        throw new HttpError(403, "blocked");
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
    if (conv !== GENERAL && peer && !peer.demo) {
        // Only when the other person isn't looking at the app right now.
        const subject = pushSubject(req);
        background(async () => {
            const seen = Number(await cmd("ZSCORE", "dpres", peer.id)) || 0;
            if (Date.now() - seen < 20000)
                return;
            await notify("messages", subject, async (p) => ({ title: u.name, body: short(await tr(text, u.lang, p)), url: "/messages/" + encodeURIComponent(conv), tag: "m-" + conv }), [peer.id]);
        });
    }
    return json({ message: (await forReader(u, [msg]))[0] }, 201);
});
route("POST", "conversations/([\\w:-]+)/read", async ({ user, m }) => {
    await checkConv(user, m[1]);
    const n = (await cmd("LLEN", "dm:" + m[1]));
    await cmd("HSET", "dr:" + user.id, m[1], n);
    return json({ ok: true });
});
let lastEvent = { v: 0, at: 0 };
// Polled by the app every few seconds. Costs one storage read when nothing changed.
route("GET", "sync", async ({ req, url, user }) => {
    const u = user;
    remindersSoon(pushSubject(req));
    maybeMonitor(req);
    maybeFlushDigest(req);
    const lite = await liteNow();
    const since = Number(url.searchParams.get("since")) || 0;
    // Presence for the plenary hall rides along with the poll (same round
    // trip). The "last event" time is shared for 2 s per instance, so a
    // crowd polling at once reads it once instead of once per phone.
    let lastAt;
    if (Date.now() - lastEvent.at < 2000) {
        lastAt = lastEvent.v;
        await cmd("ZADD", "dpres", Date.now(), u.id);
    }
    else {
        const [rawLast] = await pipe(["GET", "devat"], ["ZADD", "dpres", Date.now(), u.id]);
        lastAt = Number(rawLast) || 0;
        lastEvent = { v: lastAt, at: Date.now() };
    }
    if (!since || lastAt <= since)
        return json({ now: Math.max(lastAt, since || Date.now()), lite, messages: [], agenda: false, matches: [], announce: false, request: false });
    const events = (await cmd("LRANGE", "dev", 0, 99))
        .map((r) => parse(r))
        .filter((e) => !!e && e.at > since)
        .reverse();
    const blocked = await blockedBy(u);
    const msgs = events.filter((e) => e.type === "message" && e.msg && canSee(u, e.msg.conv) && !blocked.has(e.msg.from)).map((e) => e.msg);
    const agenda = events.some((e) => e.type === "agenda" && (!e.lang || e.lang === u.lang));
    const agendaChange = events.some((e) => e.type === "agenda" && e.sessionId);
    const matches = events.filter((e) => e.type === "match" && e.users?.includes(u.id)).map((e) => e.users.find((x) => x !== u.id));
    const matchUsers = (await Promise.all(matches.map(getUser))).filter(Boolean).map(publicUser);
    const announce = events.some((e) => e.type === "announce");
    const approvals = events.filter((e) => e.type === "approvals").reduce((a, e) => Math.max(a, e.at || 1), 0) || false;
    const quest = events.some((e) => e.type === "quest");
    // Organizers hear about new requests; the sender hears about replies.
    const request = events.some((e) => e.type === "request" && (e.to === u.id || (e.to === "admins" && u.role === "admin")));
    const signup = u.role === "admin" && events.some((e) => e.type === "signup" && e.pending);
    const users = u.role === "admin" && events.some((e) => e.type === "signup" || e.type === "users");
    const removed = events.filter((e) => e.type === "msgdel" && canSee(u, e.conv)).map((e) => ({ conv: e.conv, id: e.id }));
    const report = u.role === "admin" && events.some((e) => e.type === "report");
    return json({ now: lastAt, lite, messages: await forReader(u, msgs), agenda, agendaChange, matches: matchUsers, announce, request, approvals, quest, signup, users, removed, report });
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
        const tr = bios[i] != null ? { text: bios[i], translated: bios[i] !== x.bio } : (await liteNow()) ? { text: x.bio, translated: false } : await translate(x.bio, from, reader.lang);
        return { ...out, bio: tr.text, bioOriginal: x.bio, bioTranslated: tr.translated };
    }));
}
route("GET", "meet/deck", async ({ user }) => {
    const u = user;
    const [all, swiped] = await pipe(["SMEMBERS", "dusers"], ["SMEMBERS", "dsw:" + u.id]);
    const seen = new Set([...swiped, ...blockedBy(u)]);
    const ids = all.filter((x) => x !== u.id && !seen.has(x));
    // Shuffle, then take a small batch.
    for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    const users = (await usersByIds(ids.slice(0, 40))).filter((x) => x.meet !== false && listed(x)).slice(0, 15);
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
    if (!target || target.id === u.id || !listed(target) || blockedBy(u).has(target.id))
        throw new HttpError(404, "not_found");
    if (await limited("swipe:" + u.id, 120, 60))
        throw new HttpError(429, "rate_limited");
    const like = Boolean(b.like);
    const res = await pipe(["SADD", "dsw:" + u.id, target.id], ...(like ? [["SADD", "dlk:" + u.id, target.id], ["SISMEMBER", "dlk:" + target.id, u.id]] : []));
    const match = like && (res[2] === 1 || isDemo(target.id));
    if (match) {
        await pipe(["SADD", "dmatch:" + u.id, target.id], ["SADD", "dmatch:" + target.id, u.id]);
        await pushEvent({ at: Date.now(), type: "match", users: [u.id, target.id] });
        if (!target.demo) {
            const subject = pushSubject(req);
            background(() => notify("messages", subject, (p) => ({ title: pt(p, "match"), body: pt(p, "matchBody", { n: u.name }), url: "/messages/" + encodeURIComponent(dmId(u.id, target.id)), tag: "match" }), [target.id]));
        }
    }
    return json({ match, peer: match ? publicUser(target) : null, conv: match ? dmId(u.id, target.id) : null });
});
// ------------------------------------------------------------ plenary hall (who is in the app right now)
const ONLINE_MS = 30000;
let presenceTrimmed = 0;
// Who is in the hall, shared by everyone on the same instance for 5 s.
// Only the 150 most recent are drawn; the total comes from ZCOUNT, so a
// full hall doesn't ship every member id from storage on each call.
const hall = () => cached("hall", 5000, async () => {
    const now = Date.now();
    const [newest, total] = await pipe(["ZREVRANGEBYSCORE", "dpres", "+inf", now - ONLINE_MS, "LIMIT", 0, 150], ["ZCOUNT", "dpres", now - ONLINE_MS, "+inf"]);
    const ids = newest.slice().reverse();
    for (const d of DEMO)
        if (demoOn() && !ids.includes(d.id))
            ids.unshift(d.id);
    const people = (await usersByIds(ids)).filter(listed).map(publicUser);
    return { people, total: Number(total) || 0 };
});
route("GET", "plenary", async ({ user }) => {
    const now = Date.now();
    const trim = now - presenceTrimmed > 60000;
    if (trim)
        presenceTrimmed = now;
    await pipe(["ZADD", "dpres", now, user.id], ...(trim ? [["ZREMRANGEBYSCORE", "dpres", "-inf", now - 10 * 60000]] : []));
    const h = await hall();
    let people = h.people;
    let count = h.total;
    if (!people.some((p) => p.id === user.id)) {
        people = [...people.slice(-149), publicUser(user)];
        count += 1;
    }
    return json({ people, count: Math.max(people.length, count) });
});
// ------------------------------------------------------------ directory and congress team
async function allUsers() {
    const ids = await cmd("SMEMBERS", "dusers");
    return usersByIds(ids);
}
route("GET", "people/([\\w-]+)", async ({ user, m }) => {
    const p = await getUser(m[1]);
    if (!p || (!listed(p) && user.role !== "admin" && p.id !== user.id))
        throw new HttpError(404, "not_found");
    const [out] = await withBio(user, [p]);
    return json({ person: { ...out, blocked: (user.blocked || []).includes(p.id), canBlock: p.role !== "admin" && !p.demo } });
});
// ------------------------------------------------------------ block and report
// Blocking hides the person's messages, keeps them out of each other's Meet
// cards and stops private messages both ways. Organizers can't be blocked
// (delegates must be able to reach the team), but they can be reported.
const blockedBy = (u) => new Set([...(u.blocked || []), ...(u.blockedBy || [])]);
route("POST", "people/([\\w-]+)/block", async ({ req, user, m }) => {
    const b = await readJson(req);
    const target = await getUser(m[1]);
    if (!target || target.id === user.id)
        throw new HttpError(404, "not_found");
    if (target.role === "admin" || target.demo)
        throw new HttpError(403, "cant_block");
    if (await limited("blk:" + user.id, 60, 3600))
        throw new HttpError(429, "rate_limited");
    const on = b.block !== false;
    const toggle = (list, id) => (on ? [...new Set([...(list || []), id])] : (list || []).filter((x) => x !== id)).slice(-500);
    user.blocked = toggle(user.blocked, target.id);
    target.blockedBy = toggle(target.blockedBy, user.id);
    await saveUser(user);
    await saveUser(target);
    return json({ blocked: on });
});
const REPORT_REASONS = ["harassment", "spam", "fake", "inappropriate", "other"];
route("POST", "people/([\\w-]+)/report", async ({ req, user, m }) => {
    const target = await getUser(m[1]);
    if (!target || target.id === user.id)
        throw new HttpError(404, "not_found");
    if (await limited("rep:" + user.id, 10, 3600))
        throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    const reason = REPORT_REASONS.includes(b.reason) ? b.reason : "other";
    // A copy of the reported message, so organizers see it even if it is deleted later.
    let msg = null;
    if (typeof b.msgId === "string" && typeof b.conv === "string" && canSee(user, b.conv)) {
        const raw = await cmd("LRANGE", "dm:" + b.conv, -300, -1);
        const hit = raw.map((r) => parse(r)).find((x) => x?.id === b.msgId && x.from === target.id);
        if (hit)
            msg = { id: hit.id, conv: hit.conv, text: hit.text, at: hit.at };
    }
    const rep = { id: newId(), at: Date.now(), by: user.id, byName: user.name, target: target.id, targetName: target.name, reason, text: clean(b.text, 500), msg, status: "open" };
    await pipe(["SET", "drep:" + rep.id, JSON.stringify(rep)], ["LPUSH", "dreps", rep.id], ["LTRIM", "dreps", 0, 499]);
    await pushEvent({ at: Date.now(), type: "report" });
    const subject = pushSubject(req);
    background(async () => {
        const admins = (await allUsers()).filter((x) => x.role === "admin" && !x.demo).map((x) => x.id);
        await notify("messages", subject, (p) => ({ title: pt(p, "report"), body: pt(p, "reportBody", { n: target.name }), url: "/admin/reports", tag: "report" }), admins);
    });
    return json({ ok: true }, 201);
});
route("GET", "photo/([\\w-]+)", async ({ m }) => {
    const b64 = await cmd("GET", "dph:" + m[1]);
    if (!b64)
        throw new HttpError(404, "not_found");
    // The URL carries a version, so the image can be cached for good.
    return new Response(Buffer.from(b64, "base64"), { headers: { "content-type": "image/jpeg", "cache-control": "private, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
});
route("GET", "team", async ({ user }) => {
    const team = (await listedUsers())
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
        const tr = hits[i] != null ? { text: hits[i], translated: hits[i] !== f.text } : await translate(f.text, f.from, reader.lang);
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
    const subject = pushSubject(req);
    background(() => notify("announce", subject, async (u) => ({ title: `${pt(u, "ann")}: ${short(await tr(a.title, a.lang, u), 80)}`, body: short(await tr(a.body, a.lang, u)), url: "/info", tag: "a-" + a.id })));
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
    if (b.reply !== undefined && q.reply) {
        const subject = pushSubject(req);
        background(() => notify("messages", subject, async (p) => ({ title: pt(p, "reply"), body: short(await tr(q.reply, q.replyLang, p)), url: "/requests", tag: "q-" + q.id }), [q.uid]));
    }
    return json({ request: q });
});
// ------------------------------------------------------------ explorer quest (QR stations, points, rewards)
// Each station has a secret code printed as a QR (/q/<code>). Organizers see
// the codes and print them from the app.
const QUEST_SEED = {
    stations: [
        ["Welcome Desk", 25], ["Plenary Hall", 50], ["Global Village", 75], ["Turkish Culture Corner", 75],
        ["Partner Expo", 50], ["Merch Corner", 25], ["Sunset Terrace", 50], ["Workshop Rooms", 25],
        ["Photo Wall", 25], ["Exchange Hub", 50], ["Gala Night", 75], ["Closing Hall", 50],
    ].map(([name, pts], i) => ({ id: "st" + (i + 1), name, pts })),
    rewards: [
        ["Sticker pack", 100], ["Limited edition pin", 150], ["Coffee voucher", 200],
        ["Conference bracelet", 250], ["Culture night keepsake", 350], ["EUROXPRO tote bag", 500],
    ].map(([name, cost], i) => ({ id: "rw" + (i + 1), name, cost })),
};
async function loadQuest() {
    let q = parse(await cmd("GET", "dquest"));
    if (!q) {
        q = JSON.parse(JSON.stringify(QUEST_SEED));
        for (const s of q.stations)
            s.code = randomBytes(5).toString("base64url").replace(/[-_]/g, "x").slice(0, 6).toUpperCase();
        await cmd("SET", "dquest", JSON.stringify(q), "NX");
        q = parse(await cmd("GET", "dquest")) || q;
    }
    return q;
}
const questOf = async (uid) => parse(await cmd("GET", "dqst:" + uid)) || { done: [], points: 0, spent: 0, claims: [] };
// The leaderboard reads every player, so it is shared per instance for 10 s.
const questBoard = () => cached("qboard", 10000, buildQuestBoard);
async function buildQuestBoard() {
    const ids = await cmd("SMEMBERS", "dqplayers");
    if (!ids.length)
        return [];
    const [states, users] = await Promise.all([cmd("MGET", ...ids.map((x) => "dqst:" + x)), usersByIds(ids)]);
    const byId = new Map(users.map((u) => [u.id, u]));
    return ids
        .map((id, i) => ({ u: byId.get(id), q: parse(states[i]) }))
        .filter((x) => listed(x.u) && x.q?.points)
        .sort((a, b) => b.q.points - a.q.points || a.q.lastAt - b.q.lastAt)
        .map((x) => ({ ...publicUser(x.u), points: x.q.points, stations: x.q.done.length }));
}
route("GET", "quest", async ({ user }) => {
    const [q, mine, board] = await Promise.all([loadQuest(), questOf(user.id), questBoard()]);
    const admin = user.role === "admin";
    return json({
        stations: q.stations.map((s) => ({ id: s.id, name: s.name, pts: s.pts, done: mine.done.includes(s.id), ...(admin ? { code: s.code } : {}) })),
        rewards: q.rewards.map((r) => ({ ...r, claimed: mine.claims.find((c) => c.rid === r.id)?.status || "" })),
        points: mine.points,
        balance: mine.points - mine.spent,
        rank: board.findIndex((b) => b.id === user.id) + 1,
        board: board.slice(0, 10),
    });
});
route("POST", "quest/checkin", async ({ req, user }) => {
    if (await limited("qchk:" + user.id, 20, 300))
        throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    const code = clean(b.code, 20).toUpperCase().replace(/[^A-Z0-9]/g, "");
    const q = await loadQuest();
    const st = q.stations.find((s) => s.code === code);
    if (!st)
        throw new HttpError(404, "bad_code");
    const mine = await questOf(user.id);
    const fresh = !mine.done.includes(st.id);
    if (fresh) {
        mine.done.push(st.id);
        mine.points += st.pts;
        mine.lastAt = Date.now();
        await pipe(["SET", "dqst:" + user.id, JSON.stringify(mine)], ["SADD", "dqplayers", user.id]);
        forget("qboard");
        await pushEvent({ at: Date.now(), type: "quest" });
    }
    return json({ station: { id: st.id, name: st.name, pts: st.pts }, fresh, points: mine.points, all: mine.done.length === q.stations.length });
});
route("POST", "quest/claim", async ({ req, user }) => {
    const b = await readJson(req);
    const q = await loadQuest();
    const r = q.rewards.find((x) => x.id === b.rewardId);
    if (!r)
        throw new HttpError(404, "not_found");
    const mine = await questOf(user.id);
    if (mine.claims.some((c) => c.rid === r.id))
        throw new HttpError(409, "already_claimed");
    if (mine.points - mine.spent < r.cost)
        throw new HttpError(400, "not_enough_points");
    mine.spent += r.cost;
    mine.claims.push({ rid: r.id, at: Date.now(), status: "pending" });
    await cmd("SET", "dqst:" + user.id, JSON.stringify(mine));
    return json({ ok: true, balance: mine.points - mine.spent });
});
// Organizers: who claimed what, and mark it handed over.
route("GET", "quest/claims", async ({ user }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const ids = await cmd("SMEMBERS", "dqplayers");
    const [q, states, users] = await Promise.all([loadQuest(), ids.length ? cmd("MGET", ...ids.map((x) => "dqst:" + x)) : [], usersByIds(ids)]);
    const byId = new Map(users.map((u) => [u.id, u]));
    const claims = [];
    ids.forEach((id, i) => {
        const st = parse(states[i]);
        for (const c of st?.claims || [])
            claims.push({ uid: id, name: byId.get(id)?.name || "?", entity: byId.get(id)?.entity || "", reward: q.rewards.find((r) => r.id === c.rid)?.name || c.rid, rid: c.rid, at: c.at, status: c.status });
    });
    return json({ claims: claims.sort((a, b) => b.at - a.at) });
});
route("POST", "quest/claims/([\\w-]+)/([\\w-]+)", async ({ user, m }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const mine = await questOf(m[1]);
    const c = mine.claims.find((x) => x.rid === m[2]);
    if (!c)
        throw new HttpError(404, "not_found");
    c.status = c.status === "given" ? "pending" : "given";
    await cmd("SET", "dqst:" + m[1], JSON.stringify(mine));
    return json({ ok: true, status: c.status });
});
// ------------------------------------------------------------ approvals league (LC/MC race, like AIESEC's "top performing LCs")
// Per LC and product: approvals (apd), realizations (re), completes (co).
// Starts with illustrative numbers ("demo": true) until organizers save real ones.
const PRODUCTS = ["GV", "GTa", "GTe"];
const METRICS = ["apd", "re", "co"];
const APPR_SEED = [
    ["Istanbul", "Türkiye", 190, 6], ["Ankara", "Türkiye", 170, 4], ["Antalya", "Türkiye", 150, 9], ["Izmir", "Türkiye", 160, -1], ["Kocaeli", "Türkiye", 150, 7],
    ["Warsaw", "Poland", 175, 3], ["Krakow", "Poland", 160, 7], ["Munich", "Germany", 200, 12], ["Berlin", "Germany", 165, 2],
    ["Milan", "Italy", 180, 5], ["Rome", "Italy", 170, 11], ["Madrid", "Spain", 175, -2], ["Seville", "Spain", 168, 10],
    ["Vienna", "Austria", 172, 4], ["Bucharest", "Romania", 185, 8], ["Porto", "Portugal", 150, 3], ["Lyon", "France", 150, 6],
    ["Athens", "Greece", 140, -3], ["Prague", "Czechia", 150, 5], ["Budapest", "Hungary", 155, 2], ["Antwerp", "Belgium", 176, 3],
].map(([city, mc, goal, week], i) => {
    // Stable pseudo-random split so the sample looks like real data.
    const r = (k) => ((Math.sin((i + 1) * 97.3 + k * 13.7) + 1) / 2);
    const gv = Math.round(goal * (0.45 + r(1) * 0.2)), gta = Math.round(goal * (0.15 + r(2) * 0.15)), gte = Math.round(goal * (0.05 + r(3) * 0.1));
    const p = {};
    [["GV", gv], ["GTa", gta], ["GTe", gte]].forEach(([k, apd], j) => {
        const re = Math.round(apd * (0.55 + r(4 + j) * 0.3));
        p[k] = { apd, re, co: Math.round(re * (0.3 + r(7 + j) * 0.4)) };
    });
    return { id: "lc" + (i + 1), name: "AIESEC in " + city, mc, goal, week, p };
});
const lcTotal = (x, m = "apd") => PRODUCTS.reduce((a, k) => a + (x.p?.[k]?.[m] || 0), 0);
// Older saves had one "approved" number per LC: count it as GV approvals.
function normalizeLc(x) {
    if (!x.p)
        x.p = { GV: { apd: x.approved || 0, re: 0, co: 0 } };
    for (const k of PRODUCTS)
        x.p[k] = { apd: 0, re: 0, co: 0, ...(x.p[k] || {}) };
    x.approved = lcTotal(x);
    return x;
}
async function loadApprovals() {
    const d = parse(await cmd("GET", "dappr")) || { demo: true, updatedAt: 0, lcs: JSON.parse(JSON.stringify(APPR_SEED)) };
    d.lcs.forEach(normalizeLc);
    return d;
}
// Same numbers for everyone, so the CDN answers it: a crowd on the league
// page (or a herd after an organizer saves) costs one function call per
// region every few seconds. The app adds ?v=<save time> after a save, which
// is a fresh cache key, so nobody is served the old numbers.
route("GET", "approvals", async () => json(await loadApprovals(), 200, {
    "cache-control": "public, max-age=0, must-revalidate",
    "vercel-cdn-cache-control": "public, s-maxage=5, stale-while-revalidate=30",
}), true);
route("POST", "approvals", async ({ req, user }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const b = await readJson(req, 128 * 1024);
    if (!Array.isArray(b.lcs) || b.lcs.length > 300)
        throw new HttpError(400, "bad_data");
    const old = await loadApprovals();
    const num = (v) => Math.max(0, Math.min(100000, Math.round(Number(v) || 0)));
    const lcs = b.lcs
        .map((x) => {
            const prev = old.lcs.find((o) => o.id === x.id);
            const p = {};
            for (const k of PRODUCTS)
                p[k] = Object.fromEntries(METRICS.map((m) => [m, num(x.p?.[k]?.[m])]));
            const lc = normalizeLc({ id: /^[\w-]{1,20}$/.test(String(x.id || "")) ? String(x.id) : newId(), name: clean(x.name, 60), mc: clean(x.mc, 40), goal: num(x.goal), p });
            lc.week = prev ? (prev.week || 0) + lc.approved - prev.approved : 0;
            return lc;
        })
        .filter((x) => x.name);
    const data = { demo: false, updatedAt: Date.now(), lcs };
    await cmd("SET", "dappr", JSON.stringify(data));
    await pushEvent({ at: data.updatedAt, type: "approvals" });
    return json(data);
});
// New week: today's numbers become the base for the "this week" arrows.
route("POST", "approvals/new-week", async ({ user }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const data = await loadApprovals();
    for (const x of data.lcs)
        x.week = 0;
    data.demo = false;
    data.updatedAt = Date.now();
    await cmd("SET", "dappr", JSON.stringify(data));
    await pushEvent({ at: data.updatedAt, type: "approvals" });
    return json(data);
});
// ------------------------------------------------------------ conference store (reserve now, pay and collect at the venue)
const STORE_SEED = [
    ["wb-azure", "Wristband · Azure", 4, "accessories", "#2E86C1", ""], ["wb-coral", "Wristband · Coral", 4, "accessories", "#F06B5B", ""],
    ["wb-sea", "Wristband · Seafoam", 4, "accessories", "#4DB6A0", ""], ["tshirt", "EUROXPRO T-shirt", 18, "apparel", "#7A1F3D", "XS,S,M,L,XL,XXL"],
    ["tote", "Mediterranean tote bag", 12, "accessories", "#E9D8BC", ""], ["pin", "Enamel pin", 6, "accessories", "#C9A227", ""],
    ["bottle", "Reusable bottle", 14, "accessories", "#1F4D6B", ""], ["notebook", "Notebook", 8, "stationery", "#3B3B3B", ""],
].map(([id, name, price, cat, color, sizes]) => ({ id, name, price, cat, color, sizes: sizes ? sizes.split(",") : [], on: true }));
async function loadStore() {
    return parse(await cmd("GET", "dstore")) || STORE_SEED;
}
async function loadReservations() {
    const ids = await cmd("LRANGE", "dresids", 0, 999);
    return ids.length ? (await cmd("MGET", ...ids.map((x) => "dres:" + x))).map((r) => parse(r)).filter(Boolean) : [];
}
route("GET", "store", async ({ user }) => {
    const [products, all] = await Promise.all([loadStore(), loadReservations()]);
    return json({ products, reservations: user.role === "admin" ? all : all.filter((r) => r.uid === user.id) });
});
route("POST", "store/reserve", async ({ req, user }) => {
    if (await limited("res:" + user.id, 10, 3600))
        throw new HttpError(429, "rate_limited");
    const b = await readJson(req);
    const products = await loadStore();
    const items = (Array.isArray(b.items) ? b.items : [])
        .slice(0, 20)
        .map((x) => {
            const p = products.find((pp) => pp.id === x.id && pp.on);
            const qty = Math.max(1, Math.min(10, Math.round(Number(x.qty) || 1)));
            if (!p || (p.sizes.length && !p.sizes.includes(x.size)))
                return null;
            return { id: p.id, name: p.name, size: p.sizes.length ? x.size : "", qty, price: p.price };
        })
        .filter(Boolean);
    if (!items.length)
        throw new HttpError(400, "empty");
    const r = { id: newId(), uid: user.id, name: user.name, entity: user.entity || "", items, total: items.reduce((a, x) => a + x.qty * x.price, 0), at: Date.now(), status: "reserved" };
    await pipe(["SET", "dres:" + r.id, JSON.stringify(r)], ["LPUSH", "dresids", r.id]);
    return json({ reservation: r }, 201);
});
route("POST", "store/reservations/([\\w-]+)", async ({ req, user, m }) => {
    const r = parse(await cmd("GET", "dres:" + m[1]));
    if (!r || (r.uid !== user.id && user.role !== "admin"))
        throw new HttpError(404, "not_found");
    const b = await readJson(req);
    // Take one item out of a reservation that is not collected yet; the last
    // item out cancels it.
    if (Number.isInteger(b.remove)) {
        if (r.status !== "reserved" || !r.items[b.remove])
            throw new HttpError(400, "bad_status");
        if (r.items.length === 1)
            r.status = "cancelled";
        else {
            r.items.splice(b.remove, 1);
            r.total = r.items.reduce((a, x) => a + x.qty * x.price, 0);
        }
    }
    // Delegates and organizers can cancel; organizers mark collected.
    else if (b.status === "cancelled" && r.status === "reserved")
        r.status = "cancelled";
    else if (user.role === "admin" && ["reserved", "collected"].includes(b.status))
        r.status = b.status;
    else
        throw new HttpError(400, "bad_status");
    await cmd("SET", "dres:" + r.id, JSON.stringify(r));
    return json({ reservation: r });
});
route("POST", "store/products/([\\w-]+)", async ({ req, user, m }) => {
    if (user.role !== "admin")
        throw new HttpError(403, "forbidden");
    const b = await readJson(req);
    const products = await loadStore();
    const p = products.find((x) => x.id === m[1]);
    if (!p)
        throw new HttpError(404, "not_found");
    if (typeof b.on === "boolean")
        p.on = b.on;
    if (b.price !== undefined)
        p.price = Math.max(0, Math.min(500, Number(b.price) || 0));
    await cmd("SET", "dstore", JSON.stringify(products));
    return json({ product: p });
});
// ------------------------------------------------------------ where delegates come from (for the world map)
// `delegates` feeds the Global Connections map. `connections` counts pairs of
// delegates from different countries who matched in Meet or started a chat.
// Reads every delegate's matches and chats, so the answer is built at most
// once a minute per instance and shared by everyone who opens the map.
route("GET", "world", async () => json(await cached("world", 60000, worldMap)));
async function worldMap() {
    const users = await listedUsers();
    const home = new Map(users.map((u) => [u.id, countryOf(u.entity)?.code || ""]));
    const links = users.length ? await pipe(...users.flatMap((u) => [["SMEMBERS", "dmatch:" + u.id], ["SMEMBERS", "dconvs:" + u.id]])) : [];
    const pairs = new Set();
    users.forEach((u, i) => {
        const peers = [...(links[2 * i] || []), ...(links[2 * i + 1] || []).map((c) => String(c).slice(3).split(":").find((x) => x !== u.id))];
        for (const p of peers) {
            const a = home.get(u.id), b = home.get(p);
            if (a && b && a !== b)
                pairs.add([u.id, p].sort().join(":"));
        }
    });
    return { entities: users.map((u) => u.entity || "").filter(Boolean), delegates: users.map(publicUser), connections: pairs.size };
}
// ------------------------------------------------------------ personal congress recap (shareable story)
route("GET", "recap", async ({ user }) => {
    const u = user;
    const [matches, dms, quest, board] = await Promise.all([cmd("SMEMBERS", "dmatch:" + u.id), cmd("SMEMBERS", "dconvs:" + u.id), questOf(u.id), questBoard()]);
    const lens = dms.length ? await pipe(...dms.map((c) => ["LLEN", "dm:" + c])) : [];
    let top = null;
    dms.forEach((c, i) => {
        if (!top || lens[i] > top.n)
            top = { conv: c, n: Number(lens[i]) || 0 };
    });
    let topPeer = null;
    if (top?.n) {
        const peerId = top.conv.slice(3).split(":").find((x) => x !== u.id);
        const p = peerId && (await getUser(peerId));
        if (p)
            topPeer = { ...publicUser(p), messages: top.n };
    }
    const met = await usersByIds(matches);
    const countries = [...new Set(met.map((x) => x.entity).filter(Boolean))];
    return json({
        name: u.name,
        entity: u.entity || "",
        matches: matches.length,
        chats: dms.length,
        messages: lens.reduce((a, b) => a + (Number(b) || 0), 0),
        topPeer,
        entities: countries,
        points: quest.points,
        stations: quest.done.length,
        rank: board.findIndex((b) => b.id === u.id) + 1,
        players: board.length,
    });
});
// ------------------------------------------------------------ push notifications
// Kinds a delegate can turn off one by one in Profile.
const NOTIFY_KINDS = ["sessions", "changes", "announce", "messages"];
const notifyPrefs = (u) => Object.fromEntries(NOTIFY_KINDS.map((k) => [k, u.notify?.[k] !== false]));
const PUSH_TEXT = {
    tr: { soon: "10 dakika sonra başlıyor", ann: "Duyuru", changed: "Programda değişiklik", delayed: "Ertelendi", moved: "Yeri değişti", cancelled: "İptal edildi", scheduled: "Planlandığı gibi", newTime: "Yeni saat {t}", newPlace: "Yeni yer: {l}", reply: "Talebine yanıt geldi", match: "Yeni eşleşme", matchBody: "{n} ile eşleştin, merhaba de!", signup: "Yeni kayıt onay bekliyor", signupBody: "{n} uygulamaya katılmak istiyor.", approved: "Hesabın onaylandı", approvedBody: "EUROXPRO'27'ye hoş geldin! Uygulamayı açabilirsin.", test: "Bildirimler açık", testBody: "Oturumlar, duyurular ve mesajlar buraya gelecek.", report: "Yeni bildirim (şikayet)", reportBody: "{n} hakkında bir bildirim geldi." },
    en: { soon: "Starts in 10 minutes", ann: "Announcement", changed: "Programme change", delayed: "Delayed", moved: "Moved", cancelled: "Cancelled", scheduled: "Back on schedule", newTime: "New time {t}", newPlace: "New place: {l}", reply: "Your request got a reply", match: "New match", matchBody: "You matched with {n}, say hi!", signup: "New sign-up waiting", signupBody: "{n} wants to join the app.", approved: "Your account is approved", approvedBody: "Welcome to EUROXPRO'27! You can open the app now.", test: "Notifications are on", testBody: "Sessions, announcements and messages will show up here.", report: "New report", reportBody: "Someone reported {n}." },
    pl: { soon: "Zaczyna się za 10 minut", ann: "Ogłoszenie", changed: "Zmiana w programie", delayed: "Opóźnione", moved: "Przeniesione", cancelled: "Odwołane", scheduled: "Zgodnie z planem", newTime: "Nowa godzina {t}", newPlace: "Nowe miejsce: {l}", reply: "Twoje zgłoszenie ma odpowiedź", match: "Nowe dopasowanie", matchBody: "Masz dopasowanie z {n}, przywitaj się!", signup: "Nowa rejestracja czeka", signupBody: "{n} chce dołączyć do aplikacji.", approved: "Twoje konto zostało zatwierdzone", approvedBody: "Witamy na EUROXPRO'27! Możesz już otworzyć aplikację.", test: "Powiadomienia włączone", testBody: "Tu pojawią się sesje, ogłoszenia i wiadomości.", report: "Nowe zgłoszenie", reportBody: "Ktoś zgłosił użytkownika {n}." },
};
const pt = (u, k, vars = {}) => (PUSH_TEXT[u.lang] || PUSH_TEXT.en)[k].replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? "");
const short = (s, n = 140) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const tr = async (text, from, u) => (text && from !== u.lang ? (await translate(text, from, u.lang)).text : text);
const pushSubject = (req) => process.env.PUSH_SUBJECT || `https://${req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost"}`;
// Sends to everyone with a device who wants this kind. build(user) returns the message or null.
async function notify(kind, subject, build, only = null) {
    const ids = only ? only : await pushers();
    if (!ids.length)
        return 0;
    const users = (await cmd("MGET", ...ids.map((x) => "du:" + x))).map((r) => parse(r)).filter((u) => u && isActive(u) && notifyPrefs(u)[kind]);
    let sent = 0;
    for (let i = 0; i < users.length; i += 25) {
        const batch = users.slice(i, i + 25);
        const counts = await Promise.all(batch.map(async (u) => {
            const msg = await build(u);
            return msg ? sendToUser(u.id, msg, subject) : 0;
        }));
        sent += counts.reduce((a, b) => a + b, 0);
    }
    return sent;
}
const forPosition = (s, pos) => !s.audience?.length || !pos || s.audience.includes(pos);
const sessionStart = (day, s) => Date.parse(`${day.date}T${s.start}:00+03:00`);
// Sessions starting in the next 10 minutes. Runs from the cron route and,
// at most once a minute, alongside the app's own polling.
const REMIND_MS = 10 * 60000;
async function runReminders(subject, now = Date.now()) {
    const a = await loadAgenda();
    let sent = 0;
    for (const day of a.days)
        for (const s of day.sessions) {
            const until = sessionStart(day, s) - now;
            if (s.status === "cancelled" || until <= 0 || until > REMIND_MS + 60000)
                continue;
            if ((await cmd("SET", `drem:${s.id}:${day.date}T${s.start}`, "1", "EX", 2 * 86400, "NX")) !== "OK")
                continue;
            sent += await notify("sessions", subject, async (u) => forPosition(s, u.position)
                ? { title: await tr(s.title, "en", u), body: `${s.start} · ${await tr(s.location, "en", u)} · ${pt(u, "soon")}`, url: "/agenda/" + s.id, tag: "s-" + s.id }
                : null);
        }
    return sent;
}
let remindTried = 0;
function remindersSoon(subject) {
    if (Date.now() - remindTried < 55000)
        return; // per instance, so polling doesn't add a storage call every time
    remindTried = Date.now();
    background(async () => {
        if ((await cmd("SET", "dremlock", "1", "EX", 55, "NX")) === "OK")
            await runReminders(subject);
    });
}
route("GET", "push", async ({ user }) => json({ key: await publicKey(), subscribed: await hasSubscription(user.id), prefs: notifyPrefs(user) }));
route("POST", "push/subscribe", async ({ req, user }) => {
    const b = await readJson(req);
    if (!validSubscription(b.subscription))
        throw new HttpError(400, "bad_subscription");
    await saveSubscription(user.id, b.subscription);
    return json({ ok: true });
});
route("POST", "push/unsubscribe", async ({ req, user }) => {
    const b = await readJson(req);
    if (b.endpoint)
        await removeSubscription(user.id, b.endpoint);
    return json({ ok: true });
});
route("POST", "push/prefs", async ({ req, user }) => {
    const b = await readJson(req);
    user.notify = { ...notifyPrefs(user) };
    for (const k of NOTIFY_KINDS)
        if (typeof b[k] === "boolean")
            user.notify[k] = b[k];
    await saveUser(user);
    return json({ prefs: notifyPrefs(user) });
});
route("POST", "push/test", async ({ req, user }) => {
    if (await limited("ptest:" + user.id, 5, 300))
        throw new HttpError(429, "rate_limited");
    const sent = await sendToUser(user.id, { title: pt(user, "test"), body: pt(user, "testBody"), url: "/home", tag: "test" }, pushSubject(req));
    return json({ sent });
});
// Called every few minutes by a scheduler (see .github/workflows/app-reminders.yml).
route("GET", "push/cron", async ({ req, url }) => {
    if (process.env.CRON_SECRET && url.searchParams.get("key") !== process.env.CRON_SECRET && req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
        throw new HttpError(401, "unauthorized");
    // Testing aid outside Vercel: ?now=2027-04-01T09:52 (Antalya time).
    const sim = !process.env.VERCEL && url.searchParams.get("now") ? Date.parse(url.searchParams.get("now") + ":00+03:00") : NaN;
    return json({ sent: await runReminders(pushSubject(req), Number.isNaN(sim) ? Date.now() : sim) });
}, true);
// ------------------------------------------------------------ health watch and alerts
// Counters per minute (server errors, refused requests, sign-ups), kept per
// instance and written to storage at most every 10 s.
const statBuf = {};
let statFlushAt = 0;
function countStat(kind, n = 1) {
    statBuf[kind] = (statBuf[kind] || 0) + n;
    if (Date.now() - statFlushAt < 10000)
        return;
    statFlushAt = Date.now();
    const minute = Math.floor(Date.now() / 60000);
    const entries = Object.entries(statBuf);
    for (const [k] of entries)
        delete statBuf[k];
    background(() => pipe(...entries.flatMap(([k, v]) => [["INCRBY", `dstat:${k}:${minute}`, v], ["EXPIRE", `dstat:${k}:${minute}`, 7200]])));
}
async function statSum(kind, minutes) {
    const now = Math.floor(Date.now() / 60000);
    const keys = Array.from({ length: minutes }, (_, i) => `dstat:${kind}:${now - i}`);
    return (await cmd("MGET", ...keys)).reduce((a, v) => a + (Number(v) || 0), 0);
}
// Thresholds: what counts as "someone should look at this".
const MON = { errors10: 20, throttled10: 300, signups60: 100, slowMs: 1500, mailPct: 80 };
const MON_TEXT = {
    tr: {
        title: "EUROXPRO'27 uygulama uyarısı",
        storage: "Veritabanına ulaşılamıyor. Uygulama şu an çalışmıyor olabilir (Upstash kotası dolmuş olabilir).",
        slow: "Veritabanı yavaş yanıt veriyor ({v} ms). Gerekirse yönetim panelinden yük modunu aç.",
        errors: "Son 10 dakikada {v} sunucu hatası oldu.",
        throttled: "Son 10 dakikada {v} istek hız sınırına takıldı. Bir saldırı ya da hatalı bir cihaz olabilir.",
        signups: "Son 1 saatte {v} kayıt geldi. Bot olabilir, onay bekleyenleri kontrol et.",
        mail: "Bugünkü e-posta kotasının %{v}'i kullanıldı.",
        mailOff: "E-posta ayarı yok: kayıt ve onay e-postaları gönderilmiyor.",
    },
    en: {
        title: "EUROXPRO'27 app alert",
        storage: "The database can't be reached. The app may be down (the Upstash quota may be used up).",
        slow: "The database is answering slowly ({v} ms). Turn on load mode in the organizer panel if needed.",
        errors: "{v} server errors in the last 10 minutes.",
        throttled: "{v} requests hit the rate limit in the last 10 minutes. Possibly an attack or a faulty device.",
        signups: "{v} sign-ups in the last hour. Possibly bots: check the waiting list.",
        mail: "{v}% of today's e-mail quota is used.",
        mailOff: "No e-mail settings: sign-up and approval e-mails are not sent.",
    },
};
const monText = (lang, id, v) => (MON_TEXT[lang] || MON_TEXT.en)[id].replace("{v}", String(v));
async function runMonitor(subject, appUrl) {
    const checks = [];
    const add = (id, level, value) => checks.push({ id, level, value });
    const t0 = Date.now();
    try {
        await cmd("SET", "dmonping", String(t0), "EX", 600);
        await cmd("GET", "dmonping");
    }
    catch (e) {
        console.error("[monitor] storage", e.message);
        add("storage", "crit", 0);
        const result = { at: Date.now(), ok: false, checks };
        // No storage: no push either (keys live there). E-mail goes out
        // without the quota counter, at most once per instance per hour.
        if (Date.now() - lastStorageMail > 3600000 && mailProvider()) {
            lastStorageMail = Date.now();
            await sendMail({ to: signupRecipients(), subject: MON_TEXT.tr.title, text: `${MON_TEXT.tr.storage}\n\n${MON_TEXT.en.storage}\n\n${appUrl}` }).catch(() => { });
        }
        return result;
    }
    const ms = Date.now() - t0;
    add("slow", ms > MON.slowMs ? "warn" : "ok", ms);
    const [errors, throttled, signups] = await Promise.all([statSum("500", 10), statSum("429", 10), statSum("signup", 60)]);
    add("errors", errors >= MON.errors10 ? "warn" : "ok", errors);
    add("throttled", throttled >= MON.throttled10 ? "warn" : "ok", throttled);
    add("signups", signups >= MON.signups60 ? "warn" : "ok", signups);
    const kind = mailProvider();
    if (!kind)
        add("mailOff", "info", 0);
    else {
        const max = Number(process.env.MAIL_DAILY_MAX) || (kind === "smtp" ? 450 : 95);
        const used = Number(await cmd("GET", "dmail:" + new Date().toISOString().slice(0, 10))) || 0;
        const pct = Math.round((used / max) * 100);
        add("mail", pct >= MON.mailPct ? "warn" : "ok", pct);
    }
    const settings = await loadSettings();
    const result = { at: Date.now(), ok: !checks.some((c) => c.level === "warn" || c.level === "crit"), lite: settings.lite, checks };
    await cmd("SET", "dmon", JSON.stringify(result), "EX", 86400);
    // Each problem alerts the organizers at most once an hour.
    const bad = checks.filter((c) => c.level === "warn");
    const fresh = [];
    for (const c of bad)
        if ((await cmd("SET", "dmonal:" + c.id, "1", "EX", 3600, "NX")) === "OK")
            fresh.push(c);
    if (fresh.length) {
        const admins = (await allUsers()).filter((x) => x.role === "admin" && !x.demo);
        await notify("messages", subject, (p) => ({ title: monText(p.lang, "title"), body: fresh.map((c) => monText(p.lang, c.id, c.value)).join(" "), url: "/admin/health", tag: "health" }), admins.map((x) => x.id));
        if (kind && (await mailQuota(1))) {
            const text = [...fresh.map((c) => "- " + monText("tr", c.id, c.value)), "", ...fresh.map((c) => "- " + monText("en", c.id, c.value)), "", `${appUrl}/admin/health`].join("\n");
            await sendMail({ to: signupRecipients(), subject: MON_TEXT.tr.title, text }).catch((e) => console.error("[monitor mail]", e.message));
        }
    }
    await flushSignupDigest(appUrl).catch(() => { });
    return result;
}
let lastStorageMail = 0;
// Any open phone keeps the watch going: every 5 minutes one sync (whichever
// gets the lock) runs the checks after its answer is sent.
let monCheckedAt = 0;
function maybeMonitor(req) {
    if (Date.now() - monCheckedAt < 60000)
        return;
    monCheckedAt = Date.now();
    const subject = pushSubject(req), appUrl = appAddress(req);
    background(async () => {
        if ((await cmd("SET", "dmonlock", "1", "EX", 300, "NX")) === "OK")
            await runMonitor(subject, appUrl);
    });
}
// For an outside scheduler (GitHub Actions): answers 503 when something is
// wrong, so the failed run e-mails the repository owner even if the app
// itself can't send anything.
route("GET", "health/check", async ({ req, url }) => {
    if (process.env.CRON_SECRET && url.searchParams.get("key") !== process.env.CRON_SECRET && req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
        throw new HttpError(401, "unauthorized");
    const r = await runMonitor(pushSubject(req), appAddress(req));
    const crit = r.checks.some((c) => c.level === "crit");
    return json({ ok: r.ok, checks: r.checks.map(({ id, level, value }) => ({ id, level, value })) }, crit ? 503 : 200);
}, true);
// ------------------------------------------------------------ organizer panel (/admin in the app)
// Sign-up approval, people management, app settings and chat moderation.
// Every route checks the organizer role here, not only in the app.
const adminView = (u, seen = 0) => ({ ...me(u), createdAt: u.createdAt || 0, lastSeen: seen, owner: isOwner(u) && u.role === "admin", demo: !!u.demo, approvedBy: u.approvedBy || "", approvedAt: u.approvedAt || 0, consentAt: u.consent?.kvkkAt || 0, consentV: u.consent?.v || "" });
async function adminUsers() {
    const ids = await cmd("SMEMBERS", "dusers");
    if (!ids.length)
        return [];
    const [users, seen] = await Promise.all([usersByIds(ids), pipe(...ids.map((x) => ["ZSCORE", "dpres", x]))]);
    const at = new Map(ids.map((x, i) => [x, Number(seen[i]) || 0]));
    return users.filter((u) => !(u.demo && !demoOn())).map((u) => adminView(u, at.get(u.id)));
}
route("GET", "admin/overview", async ({ user }) => {
    needAdmin(user);
    const now = Date.now();
    const [users, settings, extra] = await Promise.all([
        adminUsers(),
        loadSettings(),
        pipe(["LLEN", "dm:" + GENERAL], ["SCARD", "dqplayers"], ["LRANGE", "dqids", 0, 499], ["LRANGE", "dresids", 0, 999], ["LRANGE", "dreps", 0, 199]),
    ]);
    const [qs, rs, reps] = await Promise.all([
        extra[2].length ? cmd("MGET", ...extra[2].map((x) => "dq:" + x)) : [],
        extra[3].length ? cmd("MGET", ...extra[3].map((x) => "dres:" + x)) : [],
        extra[4].length ? cmd("MGET", ...extra[4].map((x) => "drep:" + x)) : [],
    ]);
    const by = (st) => users.filter((u) => u.status === st).length;
    return json({
        settings,
        counts: {
            users: users.length,
            pending: by("pending"),
            active: by("active"),
            suspended: by("suspended"),
            rejected: by("rejected"),
            admins: users.filter((u) => u.role === "admin").length,
            online: users.filter((u) => now - u.lastSeen < ONLINE_MS).length,
            today: users.filter((u) => now - u.createdAt < 86400000).length,
            messages: Number(extra[0]) || 0,
            questPlayers: Number(extra[1]) || 0,
            requestsOpen: qs.map((r) => parse(r)).filter((q) => q?.status === "open").length,
            reservations: rs.map((r) => parse(r)).filter((r) => r?.status === "reserved").length,
            reportsOpen: reps.map((r) => parse(r)).filter((r) => r?.status === "open").length,
        },
        health: parse(await cmd("GET", "dmon")),
        pending: users.filter((u) => u.status === "pending").sort((a, b) => a.createdAt - b.createdAt),
    });
});
route("GET", "admin/users", async ({ user }) => {
    needAdmin(user);
    const users = await adminUsers();
    users.sort((a, b) => b.createdAt - a.createdAt);
    return json({ users });
});
route("GET", "admin/users/([\\w-]+)", async ({ user, m }) => {
    needAdmin(user);
    const u = await getUser(m[1]);
    if (!u)
        throw new HttpError(404, "not_found");
    const [seen, quest, matches, convs] = await Promise.all([cmd("ZSCORE", "dpres", u.id), questOf(u.id), cmd("SCARD", "dmatch:" + u.id), cmd("SCARD", "dconvs:" + u.id)]);
    return json({ user: { ...adminView(u, Number(seen) || 0), bio: u.bio || "", points: quest.points, stations: quest.done.length, matches: Number(matches) || 0, chats: Number(convs) || 0 } });
});
// Change status, role or profile fields of someone else.
route("POST", "admin/users/([\\w-]+)", async ({ req, user, m }) => {
    needAdmin(user);
    const u = await getUser(m[1]);
    if (!u)
        throw new HttpError(404, "not_found");
    const b = await readJson(req);
    const self = u.id === user.id;
    const before = statusOf(u);
    if (b.role !== undefined && b.role !== u.role) {
        if (!["admin", "delegate"].includes(b.role) || u.demo)
            throw new HttpError(400, "bad_role");
        if (self)
            throw new HttpError(403, "self");
        if (isOwner(u))
            throw new HttpError(403, "owner");
        u.role = b.role;
        if (u.role === "admin")
            u.status = "active";
        else
            delete u.title;
    }
    if (b.status !== undefined && b.status !== before) {
        if (!STATUSES.includes(b.status))
            throw new HttpError(400, "bad_status");
        if (self)
            throw new HttpError(403, "self");
        if (u.role === "admin")
            throw new HttpError(403, "is_admin");
        u.status = b.status;
        if (b.status === "active") {
            u.approvedBy = user.name;
            u.approvedAt = Date.now();
        }
    }
    if (b.name !== undefined) {
        const name = clean(b.name, 60);
        if (name.length < 2)
            throw new HttpError(400, "name_required");
        u.name = name;
    }
    if (b.entity !== undefined)
        u.entity = clean(b.entity, 60);
    if (b.position !== undefined)
        u.position = POSITIONS.includes(b.position) ? b.position : "";
    if (b.title !== undefined && u.role === "admin")
        u.title = clean(b.title, 40);
    if (b.bio !== undefined) {
        u.bio = clean(b.bio, 160);
        u.bioLang = u.bioLang || u.lang;
    }
    if (b.meet !== undefined)
        u.meet = Boolean(b.meet);
    if (b.photo === "") {
        await cmd("DEL", "dph:" + u.id);
        u.photoV = 0;
    }
    await saveUser(u);
    await pushEvent({ at: Date.now(), type: "users" });
    if (before !== "active" && statusOf(u) === "active" && !u.demo) {
        const subject = pushSubject(req);
        background(() => notify("messages", subject, (p) => ({ title: pt(p, "approved"), body: pt(p, "approvedBody"), url: "/home", tag: "approved" }), [u.id]));
        const appUrl = appAddress(req);
        background(() => mailApproved([u], appUrl));
    }
    return json({ user: adminView(u) });
});
// Approve everyone who is waiting.
route("POST", "admin/approve-all", async ({ req, user }) => {
    needAdmin(user);
    const waiting = (await allUsers()).filter((u) => statusOf(u) === "pending");
    const now = Date.now();
    for (const u of waiting)
        Object.assign(u, { status: "active", approvedBy: user.name, approvedAt: now });
    if (waiting.length) {
        await pipe(...waiting.map((u) => ["SET", "du:" + u.id, JSON.stringify(u)]));
        await pushEvent({ at: now, type: "users" });
        const subject = pushSubject(req);
        background(() => notify("messages", subject, (p) => ({ title: pt(p, "approved"), body: pt(p, "approvedBody"), url: "/home", tag: "approved" }), waiting.map((u) => u.id)));
        const appUrl = appAddress(req);
        background(() => mailApproved(waiting, appUrl));
    }
    return json({ approved: waiting.length });
});
// A new password for someone who forgot theirs; the organizer passes it on.
route("POST", "admin/users/([\\w-]+)/password", async ({ user, m }) => {
    needAdmin(user);
    const u = await getUser(m[1]);
    if (!u || u.demo)
        throw new HttpError(404, "not_found");
    if (isOwner(u) && u.role === "admin" && u.id !== user.id)
        throw new HttpError(403, "owner");
    const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
    const password = Array.from(randomBytes(10), (x) => alphabet[x % alphabet.length]).join("");
    const { hash, salt } = await hashPasswordAsync(password);
    u.passHash = hash;
    u.salt = salt;
    u.sv = (u.sv || 0) + 1; // signs out every device that used the old password
    await saveUser(u);
    return json({ password });
});
// Remove an account for good: profile, photo, e-mail, Meet and Quest data.
// Messages already sent stay in the chats they were sent to.
route("POST", "admin/users/([\\w-]+)/delete", async ({ user, m }) => {
    needAdmin(user);
    const u = await getUser(m[1]);
    if (!u)
        throw new HttpError(404, "not_found");
    if (u.id === user.id)
        throw new HttpError(403, "self");
    if (isOwner(u) && u.role === "admin")
        throw new HttpError(403, "owner");
    await pipe(["DEL", "du:" + u.id, "dph:" + u.id, "dsw:" + u.id, "dlk:" + u.id, "dmatch:" + u.id, "dqst:" + u.id, "dr:" + u.id], ["SREM", "dusers", u.id], ["SREM", "dqplayers", u.id], ["ZREM", "dpres", u.id], ...(u.email ? [["DEL", "de:" + u.email]] : []));
    await pushEvent({ at: Date.now(), type: "users" });
    return json({ ok: true });
});
route("GET", "admin/health", async ({ req, user, url }) => {
    needAdmin(user);
    let r = parse(await cmd("GET", "dmon"));
    if (!r || Date.now() - r.at > 5 * 60000 || url.searchParams.get("fresh"))
        r = await runMonitor(pushSubject(req), appAddress(req));
    return json({ health: r, thresholds: MON, settings: await loadSettings() });
});
route("GET", "admin/reports", async ({ user }) => {
    needAdmin(user);
    const ids = await cmd("LRANGE", "dreps", 0, 199);
    const list = ids.length ? (await cmd("MGET", ...ids.map((x) => "drep:" + x))).map((r) => parse(r)).filter(Boolean) : [];
    return json({ reports: list });
});
route("POST", "admin/reports/([\\w-]+)", async ({ req, user, m }) => {
    needAdmin(user);
    const r = parse(await cmd("GET", "drep:" + m[1]));
    if (!r)
        throw new HttpError(404, "not_found");
    const b = await readJson(req);
    if (["open", "resolved"].includes(b.status)) {
        r.status = b.status;
        r.handledBy = user.name;
        r.handledAt = Date.now();
    }
    await cmd("SET", "drep:" + r.id, JSON.stringify(r));
    return json({ report: r });
});
// Lost phone: another organizer turns two-step sign-in off for that account,
// which signs it out everywhere; it is asked to set it up again at next sign-in.
route("POST", "admin/users/([\\w-]+)/2fa-reset", async ({ user, m }) => {
    needAdmin(user);
    const u = await getUser(m[1]);
    if (!u || u.demo)
        throw new HttpError(404, "not_found");
    if (u.id === user.id)
        throw new HttpError(403, "self");
    if (isOwner(u) && u.role === "admin" && !isOwner(user))
        throw new HttpError(403, "owner");
    delete u.totp;
    delete u.totpLast;
    delete u.totpPending;
    u.sv = (u.sv || 0) + 1;
    await saveUser(u);
    return json({ ok: true });
});
route("GET", "admin/settings", async ({ user }) => {
    needAdmin(user);
    return json({ settings: await loadSettings() });
});
route("POST", "admin/settings", async ({ req, user }) => {
    needAdmin(user);
    const b = await readJson(req);
    const s = await loadSettings();
    for (const k of Object.keys(SETTINGS_DEFAULT))
        if (typeof b[k] === "boolean")
            s[k] = b[k];
    await cmd("SET", "dset", JSON.stringify(s));
    forget("settings");
    if (typeof b.lite === "boolean")
        await pushEvent({ at: Date.now(), type: "lite" });
    return json({ settings: s });
});
// General chat moderation: the latest messages, and removing one.
route("GET", "admin/chat", async ({ user }) => {
    needAdmin(user);
    const raw = await cmd("LRANGE", "dm:" + GENERAL, -100, -1);
    return json({ messages: raw.map((r) => parse(r)).filter(Boolean).reverse() });
});
route("POST", "admin/chat/([\\w-]+)/delete", async ({ user, m }) => {
    needAdmin(user);
    const raw = await cmd("LRANGE", "dm:" + GENERAL, 0, -1);
    const hit = raw.find((r) => parse(r)?.id === m[1]);
    if (!hit)
        throw new HttpError(404, "not_found");
    await cmd("LREM", "dm:" + GENERAL, 1, hit);
    await pushEvent({ at: Date.now(), type: "msgdel", conv: GENERAL, id: m[1] });
    return json({ ok: true });
});
// ------------------------------------------------------------ demo delegates
// A couple of sample people so the directory, Meet and the plenary hall are
// not empty while testing. They can't sign in, always like you back in Meet
// and always "wander" in the hall. Set DEMO_USERS=0 to leave them out.
const DEMO = [
    { id: "demo-zofia", name: "Zofia Wiśniewska", entity: "AIESEC in Poland", position: "LCP", lang: "pl", emoji: "🌷", bio: "Z Warszawy, odpowiadam za marketing. Kawa, morze i dobre rozmowy." },
    { id: "demo-luca", name: "Luca Bianchi", entity: "AIESEC in Italy", position: "MCVP", lang: "en", emoji: "☕", bio: "Talent lead from Milan. Happy to swap ideas on member experience." },
];
const demoOn = () => process.env.DEMO_USERS !== "0";
const isDemo = (id) => demoOn() && DEMO.some((d) => d.id === id);
let demoReady = null;
function ensureDemo() {
    if (!demoOn())
        return Promise.resolve();
    demoReady ??= (async () => {
        if ((await cmd("SET", "ddemo:v1", "1", "NX")) !== "OK")
            return;
        await pipe(...DEMO.map((d) => ["SET", "du:" + d.id, JSON.stringify({ ...d, email: d.id + "@demo.invalid", bioLang: d.lang, role: "delegate", demo: true, passHash: DUMMY.hash, salt: randomBytes(16).toString("hex"), createdAt: Date.now() })]), ["SADD", "dusers", ...DEMO.map((d) => d.id)]);
    })().catch((e) => {
        demoReady = null;
        console.error("[demo]", e);
    });
    return demoReady;
}
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
            if (!isConfigured && r.open !== true)
                return json({ error: "storage_missing" }, 503);
            if (r.open !== true)
                await ensureDemo();
            const user = r.open === true ? null : await currentUser(req);
            if (r.open !== true && !user)
                return json({ error: "unauthorized" }, 401);
            // Waiting, suspended and rejected accounts can only see who they are.
            if (user && r.open !== "any" && !isActive(user))
                return json({ error: "not_approved", status: statusOf(user) }, 403);
            // Organizers first turn on two-step sign-in; until then only
            // their own profile and the set-up calls answer.
            if (user && r.open !== "any" && needsTwofaSetup(user))
                return json({ error: "twofa_required" }, 403);
            const res = await r.h({ req, url: new URL(req.url), user, m });
            if (res.status === 429)
                countStat("429");
            return res;
        }
        return json({ error: "not_found" }, 404);
    }
    catch (err) {
        const e = err;
        if (e instanceof HttpError || e.status) {
            if (e.status === 429)
                countStat("429");
            return json({ error: e.message }, e.status || 500);
        }
        console.error("[delegate api]", err);
        countStat("500");
        return json({ error: "server_error" }, 500);
    }
}
export { LANGS };
