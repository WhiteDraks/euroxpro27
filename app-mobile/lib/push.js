// ============================================================
// Web Push for the delegate app, with no npm packages.
// - VAPID keys are made once and kept in storage (key "dvapid"), so no
//   environment variable is needed. VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY
//   (base64url, raw P-256) override them if set.
// - Payloads are encrypted as RFC 8291 (aes128gcm), which every browser
//   push service accepts, Apple's included (iOS 16.4+, app added to the
//   Home Screen).
// Subscriptions: hash "dpush:<userId>" (field = sha1 of the endpoint),
// plus set "dpushers" of users who have at least one.
// ============================================================
import { createCipheriv, createECDH, createHash, createPrivateKey, generateKeyPairSync, hkdfSync, randomBytes, sign } from "crypto";
import { cmd, parse, pipe } from "./kv.js";

const b64u = (buf) => Buffer.from(buf).toString("base64url");
const unb64u = (s) => Buffer.from(String(s), "base64url");

let vapidCache = null;
async function vapid() {
    if (vapidCache)
        return vapidCache;
    let keys;
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        keys = { pub: process.env.VAPID_PUBLIC_KEY, priv: process.env.VAPID_PRIVATE_KEY };
    }
    else {
        keys = parse(await cmd("GET", "dvapid"));
        if (!keys) {
            const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
            const jwk = privateKey.export({ format: "jwk" });
            const fresh = { pub: b64u(publicKey.export({ format: "der", type: "spki" }).subarray(-65)), priv: jwk.d };
            // NX: if two instances race, both end up using the one that was stored first.
            await cmd("SET", "dvapid", JSON.stringify(fresh), "NX");
            keys = parse(await cmd("GET", "dvapid")) || fresh;
        }
    }
    const pub = unb64u(keys.pub);
    const key = createPrivateKey({
        format: "jwk",
        key: { kty: "EC", crv: "P-256", d: keys.priv, x: b64u(pub.subarray(1, 33)), y: b64u(pub.subarray(33, 65)) },
    });
    vapidCache = { pub: keys.pub, key };
    return vapidCache;
}
export async function publicKey() {
    return (await vapid()).pub;
}

const jwtCache = new Map();
async function authHeader(endpoint, subject) {
    const { pub, key } = await vapid();
    const aud = new URL(endpoint).origin;
    const hit = jwtCache.get(aud);
    if (hit && hit.exp - 3600 > Date.now() / 1000)
        return hit.header;
    const exp = Math.floor(Date.now() / 1000) + 12 * 3600;
    const head = b64u(JSON.stringify({ typ: "JWT", alg: "ES256" }));
    const body = b64u(JSON.stringify({ aud, exp, sub: subject }));
    const sig = sign("sha256", Buffer.from(`${head}.${body}`), { key, dsaEncoding: "ieee-p1363" });
    const header = `vapid t=${head}.${body}.${b64u(sig)}, k=${pub}`;
    jwtCache.set(aud, { exp, header });
    return header;
}

// RFC 8291 + RFC 8188, single record.
function encrypt(payload, p256dh, authSecret) {
    const uaPublic = unb64u(p256dh);
    const auth = unb64u(authSecret);
    const ecdh = createECDH("prime256v1");
    const asPublic = ecdh.generateKeys();
    const shared = ecdh.computeSecret(uaPublic);
    const salt = randomBytes(16);
    const ikm = Buffer.from(hkdfSync("sha256", shared, auth, Buffer.concat([Buffer.from("WebPush: info\0"), uaPublic, asPublic]), 32));
    const cek = Buffer.from(hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: aes128gcm\0"), 16));
    const nonce = Buffer.from(hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: nonce\0"), 12));
    const cipher = createCipheriv("aes-128-gcm", cek, nonce);
    const body = Buffer.concat([cipher.update(Buffer.concat([Buffer.from(payload), Buffer.from([2])])), cipher.final(), cipher.getAuthTag()]);
    const rs = Buffer.alloc(4);
    rs.writeUInt32BE(4096);
    return Buffer.concat([salt, rs, Buffer.from([asPublic.length]), asPublic, body]);
}

const subId = (endpoint) => createHash("sha1").update(endpoint).digest("base64url");

export function validSubscription(s) {
    try {
        const u = new URL(String(s?.endpoint || ""));
        return u.protocol === "https:" && unb64u(s.keys?.p256dh).length === 65 && unb64u(s.keys?.auth).length === 16;
    }
    catch {
        return false;
    }
}
export async function saveSubscription(uid, s) {
    const sub = { endpoint: String(s.endpoint), keys: { p256dh: String(s.keys.p256dh), auth: String(s.keys.auth) }, at: Date.now() };
    await pipe(["HSET", "dpush:" + uid, subId(sub.endpoint), JSON.stringify(sub)], ["SADD", "dpushers", uid]);
}
export async function removeSubscription(uid, endpoint) {
    await cmd("HDEL", "dpush:" + uid, subId(String(endpoint)));
}
async function subscriptionsOf(uid) {
    const flat = (await cmd("HGETALL", "dpush:" + uid)) || [];
    const out = [];
    for (let i = 1; i < flat.length; i += 2) {
        const s = parse(flat[i]);
        if (s)
            out.push(s);
    }
    return out;
}
export async function hasSubscription(uid) {
    return (await subscriptionsOf(uid)).length > 0;
}
export async function pushers() {
    return (await cmd("SMEMBERS", "dpushers")) || [];
}

// Sends one message to every device of one user. Gone subscriptions are removed.
export async function sendToUser(uid, msg, subject) {
    const subs = await subscriptionsOf(uid);
    const payload = JSON.stringify(msg);
    const results = await Promise.all(subs.map(async (s) => {
        try {
            const res = await fetch(s.endpoint, {
                method: "POST",
                headers: {
                    authorization: await authHeader(s.endpoint, subject),
                    "content-encoding": "aes128gcm",
                    "content-type": "application/octet-stream",
                    ttl: String(msg.ttl || 6 * 3600),
                    urgency: msg.urgency || "high",
                },
                body: encrypt(payload, s.keys.p256dh, s.keys.auth),
            });
            if (res.status === 404 || res.status === 410)
                await removeSubscription(uid, s.endpoint);
            else if (!res.ok)
                console.error("[push]", res.status, (await res.text().catch(() => "")).slice(0, 200));
            return res.ok;
        }
        catch (e) {
            console.error("[push]", e);
            return false;
        }
    }));
    return results.filter(Boolean).length;
}
