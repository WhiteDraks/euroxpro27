// ============================================================
// Key-value storage for the delegate app (/app).
// On Vercel it uses Upstash Redis over its REST API (free plan, added from
// the Vercel Marketplace; the env vars below are set automatically).
// Without those variables, local development falls back to memory.
// ============================================================
const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
export const isConfigured = Boolean(URL_ && TOKEN) || !process.env.VERCEL;
async function upstash(path, body) {
    const res = await fetch(URL_ + path, {
        method: "POST",
        headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || data.error)
        throw new Error("redis: " + (data.error || res.status));
    return data;
}
const g = globalThis;
const mem = (g.__delegateMem ??= { data: new Map(), exp: new Map() });
function alive(key) {
    const e = mem.exp.get(key);
    if (e && e < Date.now()) {
        mem.data.delete(key);
        mem.exp.delete(key);
    }
    return mem.data.get(key);
}
function range(list, start, stop) {
    const n = list.length;
    const s = start < 0 ? Math.max(0, n + start) : start;
    const e = stop < 0 ? n + stop : Math.min(stop, n - 1);
    return list.slice(s, e + 1);
}
function memCmd(args) {
    const [cmd, key, ...rest] = args.map(String);
    const c = cmd.toUpperCase();
    const v = alive(key);
    switch (c) {
        case "GET":
            return typeof v === "string" ? v : null;
        case "SET": {
            if (rest.some((x) => x.toUpperCase() === "NX") && v !== undefined)
                return null;
            mem.data.set(key, rest[0]);
            const ex = rest.findIndex((x) => x.toUpperCase() === "EX");
            if (ex >= 0)
                mem.exp.set(key, Date.now() + Number(rest[ex + 1]) * 1000);
            else
                mem.exp.delete(key);
            return "OK";
        }
        case "DEL":
            return mem.data.delete(key) ? 1 : 0;
        case "INCR": {
            const n = Number(typeof v === "string" ? v : 0) + 1;
            mem.data.set(key, String(n));
            return n;
        }
        case "EXPIRE":
            if (v !== undefined)
                mem.exp.set(key, Date.now() + Number(rest[0]) * 1000);
            return v !== undefined ? 1 : 0;
        case "MGET":
            return [key, ...rest].map((k) => {
                const x = alive(k);
                return typeof x === "string" ? x : null;
            });
        case "SADD": {
            const s = v instanceof Set ? v : new Set();
            rest.forEach((x) => s.add(x));
            mem.data.set(key, s);
            return rest.length;
        }
        case "SMEMBERS":
            return v instanceof Set ? [...v] : [];
        case "RPUSH":
        case "LPUSH": {
            const l = Array.isArray(v) ? v : [];
            if (c === "RPUSH")
                l.push(...rest);
            else
                l.unshift(...rest.reverse());
            mem.data.set(key, l);
            return l.length;
        }
        case "LLEN":
            return Array.isArray(v) ? v.length : 0;
        case "LRANGE":
            return Array.isArray(v) ? range(v, Number(rest[0]), Number(rest[1])) : [];
        case "LTRIM":
            if (Array.isArray(v))
                mem.data.set(key, range(v, Number(rest[0]), Number(rest[1])));
            return "OK";
        case "HGETALL": {
            if (!(v instanceof Map))
                return [];
            return [...v.entries()].flat();
        }
        case "HSET": {
            const m = v instanceof Map ? v : new Map();
            for (let i = 0; i < rest.length; i += 2)
                m.set(rest[i], rest[i + 1]);
            mem.data.set(key, m);
            return 1;
        }
        default:
            throw new Error("memory kv: unsupported " + c);
    }
}
// ------------------------------------------------------------ public API
export async function cmd(...args) {
    if (!URL_ || !TOKEN) {
        if (process.env.VERCEL)
            throw Object.assign(new Error("storage_missing"), { status: 503 });
        return memCmd(args);
    }
    const data = (await upstash("", args));
    return data.result;
}
// Several commands in one round trip.
export async function pipe(...cmds) {
    if (!cmds.length)
        return [];
    if (!URL_ || !TOKEN) {
        if (process.env.VERCEL)
            throw Object.assign(new Error("storage_missing"), { status: 503 });
        return cmds.map(memCmd);
    }
    const data = (await upstash("/pipeline", cmds));
    return data.map((d) => {
        if (d.error)
            throw new Error("redis: " + d.error);
        return d.result;
    });
}
export function parse(raw) {
    if (typeof raw !== "string")
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
export function hashToObject(raw) {
    const out = {};
    if (Array.isArray(raw))
        for (let i = 0; i < raw.length; i += 2)
            out[String(raw[i])] = String(raw[i + 1]);
    else if (raw && typeof raw === "object")
        Object.assign(out, raw);
    return out;
}
