// EUROXPRO'27 delegate app server.
// Plain Node.js (18+), no npm dependencies. Serves the PWA from ./public
// and a small JSON API under /api. Start with: node server.js
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Read KEY=value lines from .env if present (hosts without an env panel).
try {
  for (const line of fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}
const store = require("./lib/store");
const { translate, peek, LANGS, providerName } = require("./lib/translate");

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC = path.join(__dirname, "public");
const PROD = process.env.NODE_ENV === "production";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const SESSION_DAYS = 30;
const MAX_BODY = 32 * 1024;
const MAX_MESSAGE = 2000;

const seed = JSON.parse(fs.readFileSync(path.join(__dirname, "lib", "agenda-seed.json"), "utf8"));
const db = store.load(seed);

// ---------------------------------------------------------------- helpers

const id = () => crypto.randomBytes(9).toString("base64url");
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

function checkPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passHash, "hex"));
}

function send(res, status, data, headers = {}) {
  const body = data === undefined ? "" : JSON.stringify(data);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers,
  });
  res.end(body);
}

const fail = (res, status, code) => send(res, status, { error: code });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error("too_large"), { status: 413 }));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("bad_json"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function isHttps(req) {
  return req.socket.encrypted || req.headers["x-forwarded-proto"] === "https";
}

function sessionCookie(req, token, maxAge) {
  const secure = PROD || isHttps(req) ? "; Secure" : "";
  return `exs=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function clientIp(req) {
  // Only trust the proxy header when told we run behind one.
  if (process.env.TRUST_PROXY === "1") {
    const fwd = req.headers["x-forwarded-for"];
    if (fwd) return fwd.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "?";
}

// Simple fixed-window rate limiter.
const buckets = new Map();
function limited(key, max, windowMs) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || b.reset < now) {
    b = { n: 0, reset: now + windowMs };
    buckets.set(key, b);
  }
  b.n += 1;
  return b.n > max;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
  for (const [k, s] of Object.entries(db.sessions)) if (s.expires < now) delete db.sessions[k];
}, 10 * 60 * 1000).unref();

function currentUser(req) {
  const token = parseCookies(req).exs;
  if (!token) return null;
  const s = db.sessions[sha256(token)];
  if (!s || s.expires < Date.now()) return null;
  return db.users.find((u) => u.id === s.userId) || null;
}

function publicUser(u) {
  return { id: u.id, name: u.name, entity: u.entity || "", lang: u.lang, role: u.role };
}

function me(u) {
  return { ...publicUser(u), email: u.email };
}

function startSession(req, res, user, status = 200) {
  const token = crypto.randomBytes(32).toString("base64url");
  db.sessions[sha256(token)] = { userId: user.id, expires: Date.now() + SESSION_DAYS * 864e5 };
  store.save();
  send(res, status, { user: me(user) }, { "set-cookie": sessionCookie(req, token, SESSION_DAYS * 86400) });
}

const cleanText = (v, max) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ---------------------------------------------------------------- chat

const GENERAL = "general";

function dmId(a, b) {
  return "dm:" + [a, b].sort().join(":");
}

function canSee(user, conv) {
  if (conv === GENERAL) return true;
  const parts = conv.split(":");
  return parts[0] === "dm" && parts.length === 3 && parts.includes(user.id);
}

function convPeer(user, conv) {
  if (conv === GENERAL) return null;
  const otherId = conv.split(":").slice(1).find((x) => x !== user.id) || user.id;
  return db.users.find((u) => u.id === otherId) || null;
}

async function messageFor(user, m) {
  const out = { id: m.id, conv: m.conv, from: m.from, at: m.at, lang: m.lang, original: m.text };
  const author = db.users.find((u) => u.id === m.from);
  out.fromName = author ? author.name : "—";
  if (m.lang === user.lang || m.from === user.id) {
    out.text = m.text;
    out.translated = false;
    return out;
  }
  m.t = m.t || {};
  if (m.t[user.lang]) {
    out.text = m.t[user.lang];
    out.translated = true;
    return out;
  }
  const r = await translate(m.text, m.lang, user.lang);
  if (r.translated) {
    m.t[user.lang] = r.text;
    store.save();
  }
  out.text = r.text;
  out.translated = r.translated;
  return out;
}

// SSE clients: userId -> Set<res>
const streams = new Map();

function push(userId, event, data) {
  const set = streams.get(userId);
  if (!set) return;
  const frame = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of set) res.write(frame);
}

function pushAll(event, data) {
  for (const userId of streams.keys()) push(userId, event, data);
}

async function deliver(m) {
  const targets =
    m.conv === GENERAL ? [...streams.keys()] : m.conv.split(":").slice(1).filter((x, i, a) => a.indexOf(x) === i);
  for (const uid of targets) {
    const u = db.users.find((x) => x.id === uid);
    if (u && streams.has(uid)) push(uid, "message", await messageFor(u, m));
  }
}

// ---------------------------------------------------------------- agenda

function findSession(sid) {
  for (const d of db.agenda.days) {
    const s = d.sessions.find((x) => x.id === sid);
    if (s) return s;
  }
  return null;
}

// The agenda is written in English (organizer notes in the organizer's own
// language). Other languages are machine-translated. Missing translations are
// fetched in the background and clients are told to reload when they are in,
// so opening the agenda never waits on the translation service.
const pendingAgenda = new Set();

function agendaFor(lang) {
  const a = JSON.parse(JSON.stringify(db.agenda));
  const missing = [];
  const tr = (obj, key, from = "en") => {
    const text = obj[key];
    if (!text || from === lang) return;
    const hit = peek(text, from, lang);
    if (hit != null) {
      obj[key + "Original"] = text;
      obj[key] = hit;
    } else missing.push([text, from]);
  };
  for (const d of a.days) {
    tr(d, "label");
    for (const s of d.sessions) {
      tr(s, "title");
      tr(s, "description");
      tr(s, "location");
      tr(s, "note", s.noteLang || "en");
    }
  }
  if (missing.length && !pendingAgenda.has(lang)) {
    pendingAgenda.add(lang);
    Promise.all(missing.map(([text, from]) => translate(text, from, lang)))
      .then((results) => {
        if (results.some((r) => r.translated)) pushAll("agenda", { lang });
      })
      .finally(() => pendingAgenda.delete(lang));
  }
  return a;
}

// ---------------------------------------------------------------- API

const routes = [];
const route = (method, pattern, handler, opts = {}) =>
  routes.push({ method, re: new RegExp("^" + pattern + "$"), handler, ...opts });

route("GET", "/api/health", (req, res) => send(res, 200, { ok: true, translator: providerName() }), { open: true });

route(
  "POST",
  "/api/auth/register",
  async (req, res) => {
    if (limited("reg:" + clientIp(req), 10, 60 * 60 * 1000)) return fail(res, 429, "rate_limited");
    const b = await readBody(req);
    const name = cleanText(b.name, 60);
    const email = cleanText(b.email, 120).toLowerCase();
    const entity = cleanText(b.entity, 60);
    const lang = LANGS.includes(b.lang) ? b.lang : "en";
    const password = String(b.password || "");
    if (name.length < 2) return fail(res, 400, "name_required");
    if (!EMAIL_RE.test(email)) return fail(res, 400, "email_invalid");
    if (password.length < 8 || password.length > 200) return fail(res, 400, "password_short");
    if (db.users.some((u) => u.email === email)) return fail(res, 409, "email_taken");
    const { hash, salt } = hashPassword(password);
    const user = {
      id: id(),
      email,
      name,
      entity,
      lang,
      passHash: hash,
      salt,
      role: ADMIN_EMAILS.includes(email) ? "admin" : "delegate",
      createdAt: Date.now(),
    };
    db.users.push(user);
    db.reads[user.id] = { [GENERAL]: Date.now() }; // no backlog of "unread" history
    startSession(req, res, user, 201);
  },
  { open: true }
);

// A fixed dummy so failed logins for unknown e-mails take as long as real ones.
const DUMMY = (() => {
  const { hash, salt } = hashPassword(crypto.randomBytes(12).toString("hex"));
  return { passHash: hash, salt };
})();

route(
  "POST",
  "/api/auth/login",
  async (req, res) => {
    const b = await readBody(req);
    const email = cleanText(b.email, 120).toLowerCase();
    const ip = clientIp(req);
    if (limited("login:" + ip, 30, 15 * 60 * 1000) || limited("login:" + email, 10, 15 * 60 * 1000)) {
      return fail(res, 429, "rate_limited");
    }
    const user = db.users.find((u) => u.email === email);
    const ok = checkPassword(String(b.password || ""), user || DUMMY);
    if (!user || !ok) return fail(res, 401, "bad_credentials");
    // Promote if the address was added to ADMIN_EMAILS later.
    if (ADMIN_EMAILS.includes(user.email) && user.role !== "admin") user.role = "admin";
    startSession(req, res, user);
  },
  { open: true }
);

route("POST", "/api/auth/logout", (req, res) => {
  const token = parseCookies(req).exs;
  if (token) delete db.sessions[sha256(token)];
  store.save();
  send(res, 200, { ok: true }, { "set-cookie": sessionCookie(req, "", 0) });
}, { open: true });

route("GET", "/api/me", (req, res, user) => send(res, 200, { user: me(user) }));

route("PATCH", "/api/me", async (req, res, user) => {
  const b = await readBody(req);
  if (b.name !== undefined) {
    const name = cleanText(b.name, 60);
    if (name.length < 2) return fail(res, 400, "name_required");
    user.name = name;
  }
  if (b.entity !== undefined) user.entity = cleanText(b.entity, 60);
  if (b.lang !== undefined && LANGS.includes(b.lang)) user.lang = b.lang;
  store.save();
  send(res, 200, { user: me(user) });
});

route("GET", "/api/agenda", async (req, res, user) => {
  send(res, 200, { agenda: agendaFor(user.lang) });
});

route("PATCH", "/api/agenda/sessions/([\\w-]+)", async (req, res, user, m) => {
  if (user.role !== "admin") return fail(res, 403, "forbidden");
  const s = findSession(m[1]);
  if (!s) return fail(res, 404, "not_found");
  const b = await readBody(req);
  const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (b.status !== undefined) {
    if (!["scheduled", "delayed", "moved", "cancelled"].includes(b.status)) return fail(res, 400, "bad_status");
    s.status = b.status;
  }
  if (b.start !== undefined) {
    if (!TIME.test(b.start)) return fail(res, 400, "bad_time");
    s.start = b.start;
  }
  if (b.end !== undefined) {
    if (!TIME.test(b.end)) return fail(res, 400, "bad_time");
    s.end = b.end;
  }
  if (b.location !== undefined) s.location = cleanText(b.location, 120);
  if (b.note !== undefined) {
    s.note = cleanText(b.note, 280);
    s.noteLang = user.lang;
  }
  s.updatedAt = Date.now();
  store.save();
  pushAll("agenda", { sessionId: s.id, at: s.updatedAt });
  send(res, 200, { ok: true });
});

route("GET", "/api/people", (req, res, user) => {
  const people = db.users
    .filter((u) => u.id !== user.id)
    .map(publicUser)
    .sort((a, b) => a.name.localeCompare(b.name, user.lang));
  send(res, 200, { people });
});

route("GET", "/api/conversations", async (req, res, user) => {
  const reads = db.reads[user.id] || {};
  const byConv = new Map([[GENERAL, null]]);
  for (const m of db.messages) {
    if (canSee(user, m.conv)) byConv.set(m.conv, m);
  }
  const list = [];
  for (const [conv, last] of byConv) {
    const peer = convPeer(user, conv);
    if (conv !== GENERAL && !peer) continue;
    const since = reads[conv] || 0;
    const unread = db.messages.filter((m) => m.conv === conv && m.from !== user.id && m.at > since).length;
    list.push({
      id: conv,
      peer: peer ? publicUser(peer) : null,
      last: last ? await messageFor(user, last) : null,
      unread,
    });
  }
  list.sort((a, b) => (a.id === GENERAL ? -1 : b.id === GENERAL ? 1 : (b.last?.at || 0) - (a.last?.at || 0)));
  send(res, 200, { conversations: list });
});

route("POST", "/api/conversations/dm", async (req, res, user) => {
  const b = await readBody(req);
  const peer = db.users.find((u) => u.id === b.userId);
  if (!peer || peer.id === user.id) return fail(res, 404, "not_found");
  send(res, 200, { id: dmId(user.id, peer.id), peer: publicUser(peer) });
});

route("GET", "/api/conversations/([\\w:-]+)/messages", async (req, res, user, m, url) => {
  const conv = m[1];
  if (!canSee(user, conv)) return fail(res, 404, "not_found");
  if (conv !== GENERAL && !convPeer(user, conv)) return fail(res, 404, "not_found");
  const before = Number(url.searchParams.get("before")) || Infinity;
  const all = db.messages.filter((x) => x.conv === conv && x.at < before);
  const page = all.slice(-50);
  const messages = await Promise.all(page.map((x) => messageFor(user, x)));
  const peer = convPeer(user, conv);
  send(res, 200, { messages, more: all.length > page.length, peer: peer ? publicUser(peer) : null });
});

route("POST", "/api/conversations/([\\w:-]+)/messages", async (req, res, user, m) => {
  const conv = m[1];
  if (!canSee(user, conv)) return fail(res, 404, "not_found");
  if (conv !== GENERAL && !convPeer(user, conv)) return fail(res, 404, "not_found");
  if (limited("msg:" + user.id, 30, 60 * 1000)) return fail(res, 429, "rate_limited");
  const b = await readBody(req);
  const text = cleanText(b.text, MAX_MESSAGE);
  if (!text) return fail(res, 400, "empty");
  const msg = { id: id(), conv, from: user.id, text, lang: user.lang, at: Date.now() };
  db.messages.push(msg);
  db.reads[user.id] = { ...(db.reads[user.id] || {}), [conv]: msg.at };
  store.save();
  send(res, 201, { message: await messageFor(user, msg) });
  deliver(msg).catch((e) => console.error(e));
});

route("POST", "/api/conversations/([\\w:-]+)/read", (req, res, user, m) => {
  if (!canSee(user, m[1])) return fail(res, 404, "not_found");
  db.reads[user.id] = { ...(db.reads[user.id] || {}), [m[1]]: Date.now() };
  store.save();
  send(res, 200, { ok: true });
});

route("GET", "/api/stream", (req, res, user) => {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-store",
    connection: "keep-alive",
    "x-accel-buffering": "no", // keeps nginx (common on shared hosts) from buffering
  });
  res.write("retry: 3000\n\n");
  if (!streams.has(user.id)) streams.set(user.id, new Set());
  streams.get(user.id).add(res);
  const ping = setInterval(() => res.write(": ping\n\n"), 25000);
  req.on("close", () => {
    clearInterval(ping);
    const set = streams.get(user.id);
    set.delete(res);
    if (!set.size) streams.delete(user.id);
  });
});

// ---------------------------------------------------------------- static

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": "geolocation=(self), camera=(), microphone=()",
  "content-security-policy": [
    "default-src 'self'",
    "img-src 'self' data: https://*.basemaps.cartocdn.com",
    "style-src 'self'",
    "script-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC + path.sep)) return false;
  let stat;
  try {
    stat = fs.statSync(file);
  } catch {
    return false;
  }
  if (!stat.isFile()) return false;
  const ext = path.extname(file);
  const base = path.basename(file);
  // App shell files change with each release, so they are revalidated;
  // icons and vendor files are safe to keep for a week.
  const longCache = rel.startsWith("/icons/") || rel.startsWith("/vendor/");
  res.writeHead(200, {
    "content-type": TYPES[ext] || "application/octet-stream",
    "content-length": stat.size,
    "cache-control": longCache ? "public, max-age=604800" : "no-cache",
    ...(base === "sw.js" ? { "service-worker-allowed": "/" } : {}),
  });
  if (req.method === "HEAD") return res.end(), true;
  fs.createReadStream(file).pipe(res);
  return true;
}

// ---------------------------------------------------------------- server

const server = http.createServer(async (req, res) => {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
  if (PROD || isHttps(req)) res.setHeader("strict-transport-security", "max-age=31536000");

  const url = new URL(req.url, "http://local");
  const { pathname } = url;

  try {
    if (pathname.startsWith("/api/")) {
      // Block cross-site writes: browsers always send Origin on POST/PATCH.
      if (req.method !== "GET" && req.method !== "HEAD") {
        const origin = req.headers.origin;
        if (origin && new URL(origin).host !== req.headers.host) return fail(res, 403, "bad_origin");
      }
      for (const r of routes) {
        if (r.method !== req.method) continue;
        let decoded;
        try {
          decoded = decodeURIComponent(pathname);
        } catch {
          return fail(res, 400, "bad_path");
        }
        const m = decoded.match(r.re);
        if (!m) continue;
        const user = currentUser(req);
        if (!r.open && !user) return fail(res, 401, "unauthorized");
        return await r.handler(req, res, user, m, url);
      }
      return fail(res, 404, "not_found");
    }

    if (req.method !== "GET" && req.method !== "HEAD") return fail(res, 405, "method");
    if (serveStatic(req, res, pathname)) return;
    // Any other path is an app route: hand it to the client router.
    serveStatic(req, res, "/index.html");
  } catch (err) {
    if (err.status) return fail(res, err.status, err.message);
    console.error(err);
    if (!res.headersSent) fail(res, 500, "server_error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`EUROXPRO'27 app on http://${HOST}:${PORT}  (translator: ${providerName()})`);
});

function shutdown() {
  store.saveNow();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
