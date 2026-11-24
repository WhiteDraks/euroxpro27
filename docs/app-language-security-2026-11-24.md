# Delegate app: language fix and security review (2026-11-24)

## Languages (TR / EN / PL)

What was wrong:

- Changing the language in Profile did not update the saved profile on the phone. On the next open the app
  started in the old language and only switched once the server answered (and stayed in the old language offline).
- The Home agenda card showed the English session title on first open: the translated agenda arrives a moment
  later and the card never redrew.
- Quest stations and rewards, store products and the country names in the Approvals league were always English.
- "Czechia" was not recognised as a country.
- Desktop store card: the price broke into one digit per line next to the size picker.

Fixed in `public/app.js`, `public/i18n.js` (`dataText` for the built-in names; names an organizer types stay as
typed), `public/countries.js`, `public/app.css`. Service worker bumped to v26.

Checked in Chromium at 390 px and 1440 px: every screen in TR, EN and PL, language change in Profile, reload with
`/api/me` blocked (offline), no script errors, no horizontal scroll.

## Security review

Fixed:

| Issue | Risk | Fix |
| --- | --- | --- |
| Blocking someone rewrote the blocked person's whole user record | A parallel save could undo that person's password reset, 2FA change or "sign out everywhere" | Block lists moved to Redis sets `dblk:` / `dblkby:`; `saveUser` never writes them; old inline lists are moved over on first use |
| Cross-site requests relied only on the Origin header | Defence in depth against CSRF | Non-GET requests marked `Sec-Fetch-Site: cross-site` / `same-site` are refused |
| Photos of suspended / waiting / rejected accounts were still served by id | They are hidden everywhere else | `/api/photo/:id` answers only for people others may see (organizers and the owner always) |
| Meet matches listed suspended and blocked people | Same | Filtered |
| Unlimited push devices per account | One account could make every notification fan out to many endpoints | At most 8 devices; the oldest is dropped |
| A broken `%`-escape in an API path crashed the function | 500 / noisy errors | 400 `bad_path` |
| Deleting an account left its push devices and block lists | Data left behind (KVKK) | Removed with the account |
| No `Cross-Origin-Opener-Policy` | Hardening | `same-origin` |

Reviewed, no change needed: session cookie (HttpOnly, Secure, SameSite=Lax, hashed in Redis, versioned),
organizer-only routes (all call `needAdmin` / role checks server side), DM access (canonical `dm:<a>:<b>` only),
input lengths and types, XSS (all text goes through `textContent`; `innerHTML` only for built-in SVG; strict CSP),
TOTP (replay-protected), rate limits (central in Redis), no secrets in the repository, no npm dependencies in the app.

Still open (accepted earlier): `/api/push/cron` and `/api/health/check` are open when `CRON_SECRET` is not set;
Turnstile is off until its keys are set on Vercel.

Tests: an API run against a local server, 17 checks (CSRF, block/unblock, session after
sign-out-everywhere, photo visibility, matches, bad path) plus the device cap: all pass.
