# Test report: partner section and delegate app (24 Nov 2026)

Scope: the partner section of the website and the delegate app (`app-mobile/`).
The site-wide security and accessibility pass was done the same day in PR #52
(npm audit, headers/CSP, admin API, axe, overflow) and was not repeated.

## How it was tested

- Website: production build (`next build` + `next start`), Playwright at
  iPhone 13 (390 px) and 1440 px.
- Delegate app: `node dev-server.js` with in-memory storage, Playwright at
  iPhone SE, iPhone 13, Pixel 7 and 1440 px, as an organizer and as a delegate.
  Every route (27) was opened in both roles and checked for JS errors,
  horizontal overflow and stray `null` / `undefined` text.
- E-mail: a local TLS SMTP server stood in for Gmail, so the real SMTP client
  in `lib/mail.js` was exercised end to end.
- API: sign-up validation with curl.

## Results

| Area | Check | Result |
| --- | --- | --- |
| Sign-up | name / e-mail / password rules, duplicate e-mail (case-insensitive) | Pass |
| KVKK (PR #48) | no consent → `kvkk_required`, notice only → `abroad_required`, both → account created, pending | Pass (PR #48 merged) |
| KVKK UI | error shown without the boxes, link opens the notice sheet | Pass |
| Approval | new delegate lands on the waiting screen, every API route answers `403 not_approved` | Pass |
| Approval | organizer presses Approve, the delegate's open app moves on by itself within ~6 s | Pass |
| E-mail (PR #49) | sign-up e-mail to the organizer, approval e-mail to the delegate (Turkish), HTML escaped, UTF-8 subjects | Pass against the local SMTP server |
| Screens | 27 routes × 2 roles: no JS errors, no horizontal overflow | Pass |
| Performance | welcome screen: first paint ~65 ms locally, no build step, no npm deps | Pass |
| Map | markers, filters and list render | Pass |
| Map tiles (live app) | the map background stayed empty on the live app | **Fail → fixed** (issue 1) |

## Issues found and fixed

1. **Delegate app, Map (live):** the map background (Esri tiles) never loaded
   once the app's service worker was active, i.e. for everyone after the first
   visit. The service worker downloads the tiles itself to cache them, and the
   Content-Security-Policy (`connect-src 'self'`) blocked that download. Checked
   on app-mobile-murex.vercel.app: the tile opens directly, but fails inside the
   app. `server.arcgisonline.com` is now allowed in `connect-src`
   (`app-mobile/vercel.json`).
2. **Delegate app, Meet:** on phones up to about iPhone 13 size, the profile
   picture sat on top of the delegate's name and country, so the card was
   unreadable. The picture now takes only the space left above the text and
   shrinks on short screens (`app.css`, `.card-face`).
3. **Delegate app, Profile:** delegates (not organizers) saw the word `null`
   under their e-mail address. `screen.append()` printed the empty organizer
   link as text (`app.js`, `viewProfile`).
4. **Website, partner card:** the three partner offers ("Meet leaders", "Run a
   session", "Support exchanges") and the "Partners announced soon" status were
   editable in /admin but never shown on the site. The card now shows them.
5. **Website, partner card → contact:** "Talk to us" opened the contact form on
   "General Inquiries". It now links to `/contact?topic=partnerships` and the
   form opens on "Partnerships & Media" (unknown topics fall back to general).
6. **Website admin:** the "Partnerler" tab's preview link pointed to the home
   page; the section is on `/congress`.

Service worker cache bumped to v24 so phones pick up the app fixes.

## Needs the owner (cannot be done from code)

- **E-mail settings on the `app-mobile` Vercel project.** Without
  `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` (e.g. Gmail + app password) or
  `RESEND_API_KEY`, no sign-up or approval e-mail is sent. Also set
  `APP_URL=https://app-mobile-murex.vercel.app` so links in e-mails always point
  to the public address, whichever alias the person signed up on.
- **KVKK notice is a draft.** A lawyer should check it, and the data
  controller's official title and address must be filled in (`CONTROLLER` in
  `app-mobile/public/kvkk.js`). If the text changes, bump `KVKK_VERSION` in both
  `public/kvkk.js` and `lib/api.js`.
- **Accounts created before KVKK** have no recorded consent ("not recorded" in
  the organizer panel). Decide whether to ask them again.

## Known and accepted

- The contact form opens the visitor's own e-mail app (there is no mail
  backend on the website); partner leads therefore arrive by e-mail.
- Sign-up spam could use up the daily e-mail cap (`MAIL_DAILY_MAX`); sign-ups
  are rate limited per IP and still need approval.
