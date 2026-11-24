// ============================================================
// Small security helpers for the delegate app, no packages:
// - Cloudflare Turnstile check for sign-up (invisible bot check)
// ============================================================
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
