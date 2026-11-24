// ============================================================
// Small security helpers for the delegate app, no packages:
// - TOTP codes (RFC 6238, the 6-digit codes of Google Authenticator,
//   Microsoft Authenticator, 1Password, iCloud Passwords ...)
// - Cloudflare Turnstile check for sign-up (invisible bot check)
// ============================================================
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32(buf) {
    let bits = 0, value = 0, out = "";
    for (const byte of buf) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            out += B32[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0)
        out += B32[(value << (5 - bits)) & 31];
    return out;
}

export function unbase32(s) {
    const clean = String(s || "").toUpperCase().replace(/[^A-Z2-7]/g, "");
    let bits = 0, value = 0;
    const out = [];
    for (const c of clean) {
        value = (value << 5) | B32.indexOf(c);
        bits += 5;
        if (bits >= 8) {
            out.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(out);
}

export const newTotpSecret = () => base32(randomBytes(20));

const STEP = 30;

export function totpCode(secret, counter) {
    const msg = Buffer.alloc(8);
    msg.writeBigUInt64BE(BigInt(counter));
    const mac = createHmac("sha1", unbase32(secret)).update(msg).digest();
    const off = mac[mac.length - 1] & 15;
    const n = ((mac[off] & 127) << 24) | (mac[off + 1] << 16) | (mac[off + 2] << 8) | mac[off + 3];
    return String(n % 1e6).padStart(6, "0");
}

// Accepts the code of the current 30 s step and one step either side (phone
// clocks drift). Returns the matched step so the caller can refuse a code
// that was already used (`last`), or 0 when the code is wrong.
export function checkTotp(secret, code, last = 0, now = Date.now()) {
    const c = String(code || "").replace(/\D/g, "");
    if (!secret || c.length !== 6)
        return 0;
    const cur = Math.floor(now / 1000 / STEP);
    for (const step of [cur, cur - 1, cur + 1]) {
        if (step <= last)
            continue;
        if (timingSafeEqual(Buffer.from(totpCode(secret, step)), Buffer.from(c)))
            return step;
    }
    return 0;
}

export function otpauthUrl(secret, account, issuer = "EUROXPRO27") {
    const label = encodeURIComponent(`${issuer}:${account}`);
    return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=${STEP}`;
}

// ------------------------------------------------------------ Turnstile
export const turnstileSiteKey = (env = process.env) => (env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SITE_KEY ? env.TURNSTILE_SITE_KEY : "");

// Returns true when the visitor passed. Off (always true) until both keys
// are set on Vercel. If Cloudflare itself can't be reached, sign-up stays
// open (logged): an outage there must not stop delegates from joining, and
// sign-ups still need an organizer's approval.
export async function verifyTurnstile(token, ip, { env = process.env, fetchImpl = fetch } = {}) {
    if (!turnstileSiteKey(env))
        return true;
    if (!token || typeof token !== "string" || token.length > 2048)
        return false;
    try {
        const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
        if (ip && ip !== "local")
            body.set("remoteip", ip);
        const res = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(5000) });
        if (!res.ok) {
            console.warn("[turnstile] siteverify HTTP", res.status);
            return res.status >= 500;
        }
        const data = await res.json();
        return data.success === true;
    }
    catch (e) {
        console.warn("[turnstile] unreachable:", e.message);
        return true;
    }
}
