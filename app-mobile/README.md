# EUROXPRO'27 Delegate App (PWA)

A separate web app for delegates that can be added to the home screen. It lives in the same repo as the website, but it is **its own Vercel project with its own address**. The website is not affected.

- **Home:** one big button per area, as in the 2024 app: Agenda, Delegates, CC Team, Requests, Announcements. Below them are the Plenary, Meet and Map.
- **Avatars:** a person figure, or the delegate's own photo (resized on the phone to a 320 px JPEG).
- **Live agenda:** a "Now / Up next" card, a day picker and a countdown before the congress. Organizers can mark a session delayed, moved or cancelled and add a note, and every open phone sees the change within a few seconds.
- **Map:** the airport, bus station, Kaleiçi and beaches in Antalya, with directions in Apple Maps or Google Maps.
- **Meet:** Tinder-style cards. Swipe right to like, left to pass. When two people like each other it's a match and a private chat opens.
- **Plenary:** an empty hall where small avatars of everyone signed in (last 30 seconds) wander around. Tap someone to message them.
- **Profile:** emoji avatar, short bio (translated for the reader), and a switch to show or hide yourself in Meet.
- **Congress (in Profile):** announcements with deadlines (the nearest one shows on the agenda), a delegate directory filtered by position (MCPc, MCPe, MCVP, LCP, LCVP), the CC Team page (organizers set their team title in Profile), and requests and complaints that only organizers see, with replies. Organizers can tag agenda sessions for certain positions, and delegates can switch to "My programme".
- **Demo delegates:** two sample people (Zofia, Luca) appear in the directory, Meet and the plenary hall. They always like you back. Set `DEMO_USERS=0` to hide them everywhere.
- **Chat:** a general room and one-to-one messages. Each message is translated into the reader's language automatically.
- **Languages:** Turkish, English and Polish. Polish plurals are handled.
- **Sign-in:** email and password only.
- **Design:** Apple HIG, black, bordeaux and white, with light and dark modes. It also opens offline.
- **Dependencies:** none. It is plain JS with no build step. Leaflet is bundled inside the app.

## Free setup on Vercel (one time)

1. Go to [vercel.com/new](https://vercel.com/new) and import the `WhiteDraks/euroxpro27` repo again.
2. In **Root Directory**, choose `app-mobile`. Leave Framework Preset as **Other**. Deploy.
3. In the new project, open **Storage → Upstash for Redis → Create** (free plan) and connect it to this project.
4. Under **Settings → Environment Variables**:
   - `ADMIN_EMAILS`: comma-separated organizer email addresses. Accounts registered with these addresses can edit the agenda.
   - `DEEPL_API_KEY` (recommended): a DeepL API Free key, which gives 500k characters a month at no cost. Without it, Google Translate's free web endpoint is used (MyMemory as backup). `GOOGLE_TRANSLATE_API_KEY` (Google Cloud, 500k chars a month free) also works. The language is detected from the text.
   - E-mail (optional): organizers get an e-mail for every new sign-up (default recipient `elifkurnaz@aiesec.org.tr`, change with `SIGNUP_NOTIFY_EMAIL`, comma-separated, `off` to stop), and delegates get a "your account is approved" e-mail (`APPROVAL_EMAIL=off` to stop). Pick one sender:
     - **Gmail / Google Workspace (no domain needed):** `SMTP_HOST=smtp.gmail.com`, `SMTP_USER=<the sending address>`, `SMTP_PASS=<a Google app password>` (needs 2-step verification on that account). Optional `SMTP_PORT` (default 465), `MAIL_FROM` (default `SMTP_USER`).
     - **Resend:** `RESEND_API_KEY`, plus `MAIL_FROM` on a domain verified in Resend. Without a verified domain Resend only delivers to the Resend account's own address, so approval e-mails to delegates would not arrive.
     - `APP_URL` (e.g. `https://app-mobile-murex.vercel.app`) sets the links in the e-mails. The app stops at `MAIL_DAILY_MAX` e-mails a day (default 450 for SMTP, 95 for Resend, below the free limits). Sending is best-effort: an e-mail problem never blocks sign-up or approval.
5. **Deployments → Redeploy.** The app is now live at an address like `euroxpro27-app.vercel.app`. You can also add a domain such as `app.euroxpro27.com`.

After that, every merge to `main` deploys automatically. Until Redis is connected, the app opens but sign-up shows a "still being set up" message.

## Structure

```
public/          The app itself (index.html, app.js, app.css, i18n.js, places.js, sw.js)
api/index.js     Vercel function: every /api/* request comes here
lib/api.js       Accounts, agenda, messages, sync
lib/kv.js        Upstash Redis (REST); memory when no env vars are set
lib/translate.js DeepL / LibreTranslate / MyMemory
lib/mail.js      Sign-up and approval e-mails (Resend or SMTP, no packages)
lib/security.js  Two-step sign-in codes (TOTP) and the Turnstile bot check
public/secure.js Two-step set-up, block / report and bot-check screens
scripts/load-test.mjs  Virtual delegates for load testing
lib/agenda-seed.js The first agenda (taken from the website's draft programme)
dev-server.js    Local testing, or running on any Node host
```

Live updates come from the app calling `/api/sync` while it is on screen: every 4 seconds in Messages, every 30 seconds elsewhere (with a little jitter, and backing off up to a minute when requests fail). When nothing has changed, a sync costs one storage round trip. `/api/approvals` needs no sign-in and is cached on Vercel's CDN for 5 seconds; after an organizer saves, the app asks for `/api/approvals?v=<save time>`, a fresh cache key.

**Crowd sizing (10k open phones):** about 330 syncs a second, so the Vercel project must be on Pro (Hobby's 1M requests a month last under an hour) and Upstash should be on a fixed plan (commands are not metered there; pay-as-you-go would bill every sync).

## Local testing

```bash
cd app-mobile
node dev-server.js   # http://localhost:3000, data is kept in memory
```

To see the live agenda before the congress, add `?now=2027-04-01T10:05` to the URL. `?now=off` turns it off.

## Notifications, quest, approvals, store (since #24/#25)

- **Push notifications** (`lib/push.js`, no packages): VAPID keys are made once and kept in storage (`dvapid`). Reminders 10 min before a session run while anyone polls the app and from `.github/workflows/app-reminders.yml` (congress week, every 5 min; set `CRON_SECRET` on Vercel and `APP_CRON_SECRET` in GitHub to lock `/api/push/cron`).
- **Explorer Quest** `/quest`: organizers print station QR codes from `/quest/admin` (each opens `/q/<code>`), delegates scan in-app (BarcodeDetector or bundled jsQR) and claim rewards.
- **Approvals league** `/approvals`, big-screen race `/approvals/live`, organizers edit at `/approvals/edit`. Sample numbers until saved.
- **Store** `/store`: reserve, pay and collect at the venue; organizers see totals and mark collected.
- **Global Connections** `/connections` (old `/world` link opens it too): our own SVG world map from `public/world-shapes.js` (Natural Earth, no tiles or keys), countries with delegates highlighted, one tap lists a country's delegates, counters for countries, delegates and cross-border matches/chats. Shows labelled sample data until 25 real delegates have a known country (`GC_SAMPLE_BELOW` in app.js; `?data=real` or `?data=sample` to check either). Entity to country matching lives in `public/countries.js`, shared with the API. Also: plenary heat layer, **recap story** `/recap` (shareable 1080×1920 PNG), **sunset theme** 17:00–21:00 Antalya time, confetti on matches, check-ins and rewards.

## Security and traffic (Nov 2026)

- **Sign out of all other devices** in Profile > Security. Signing out also ends that session on every server instance at once.
- **Wrong-password slowdown instead of lockout:** after 5 wrong tries for one e-mail, each further try from an unknown device waits 15 s, 30 s, 1 min ... up to 5 min. A phone that already signed in to that account (cookie `exd`) is never slowed, so nobody can lock a delegate out by knowing their e-mail.
- **Bot check at sign-up:** a hidden honeypot field always, plus Cloudflare Turnstile once `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set (free; dash.cloudflare.com > Turnstile > Add widget, hostname `app-mobile-murex.vercel.app`, mode Managed). If Cloudflare is unreachable, sign-up stays open (accounts still wait for approval).
- **Sign-up e-mails are batched:** the first sign-up e-mails at once, later ones within 15 minutes go out as one summary, so fake sign-ups can't use up the daily e-mail quota that approval e-mails need.
- **Block / report:** on a person's card, from the "•••" button in a private chat, by tapping a name in the general chat, or by long-pressing someone's message. Blocking hides their messages, removes each other from Meet and stops private messages both ways. Organizers can't be blocked. Reports (with a copy of the message) go to /admin/reports and notify organizers.
- **Load mode** (/admin > Traffic): phones poll every 10 s in chats and 60 s elsewhere (instead of 4 s / 30 s), the hall refreshes every 60 s, and messages not yet translated arrive in the original language. Takes effect on every phone within one poll.
- **System status** (/admin/health): checked every 5 minutes while anyone uses the app (database reachable and speed, server errors, rate-limited requests, sign-ups per hour, e-mail quota). A problem sends organizers a push notification and an e-mail, at most once an hour per problem. `.github/workflows/app-health.yml` also calls `/api/health/check` every 3 hours (every 10 minutes in congress week); it answers 503 when the database is down, so the failed run e-mails the repository owner. Uses the same `CRON_SECRET` / `APP_CRON_SECRET` as the reminders.
- **Per-IP limits** for sign-up (500/hour) and sign-in (500/15 min) can be raised with `RATE_IP_REGISTER` / `RATE_IP_LOGIN` if the whole venue shares one internet address.
- **Flood guard:** each server instance cuts off one account above 300 requests/minute and one address without a session above 600/minute (in memory, no storage cost). Change with `RATE_USER_MIN` / `RATE_IP_MIN`.
- **Organizer sign-in alert:** an organizer account signed in from a new device gets a push notification.
- **Vercel Firewall:** rule "Auth rate limit" answers 429 to more than 300 requests a minute from one IP on `/api/auth/*`, before the function runs. In an emergency (a flood on every route), turn on Attack Challenge Mode in the Firewall tab for a few hours; note it also challenges the app's own API calls from new visitors.
- **Load test results (local, 1000 delegates, 3 min, 10% in open chats):** normal mode about 46 syncs/s (about 167k requests/hour), load mode about 19 syncs/s (about 70k/hour, 58% fewer). In load mode the slowest syncs (p95) dropped from about 1.1 s to 3 ms because nobody waits for the translator. No server errors in either run.
- **Load test:** `ADMIN_EMAILS=load-admin@test.invalid RATE_IP_REGISTER=100000 RATE_IP_LOGIN=100000 RATE_IP_MIN=100000 node dev-server.js`, then `node scripts/load-test.mjs --users 1000 --minutes 3` (add `--lite` to test load mode). Against a deployed copy add `--url <preview url> --yes-really`; use a preview with its own database, never the live app.

## My programme, targeted announcements, QR card (Nov 2026)

- **My programme:** a star on every session (and an "Add to my programme" button on the session page). Agenda filter: All · My programme · my position; days with starred sessions get a dot. Storage: `dplan:<uid>` (a delegate's sessions), `dplanby:<sid>` (who starred a session), `dplanners` (everyone with a programme). Reminders 10 minutes before and change alerts go to people who starred the session; delegates without a programme keep getting them by position, as before.
- **Announcements to some countries:** organizers pick "Everyone" or countries (from the committees in delegates' profiles, via `public/countries.js`). Only those delegates see it in the app and get the push notification; organizers see every announcement with an "Only for" label. The post answers with how many delegates it reaches.
- **QR card** `/card`, contacts `/contacts`: every delegate has a QR code (`dctok:<code>` → id). Scanning it in the app, or with the phone camera (opens `/c/<code>`, also after signing in), saves that person to `dcon:<uid>` (hash: id → saved time and a private note). Phone, Instagram, LinkedIn and e-mail on the card are optional and only shown to people who saved it; blocked people see none of it. "Make a new code" retires the old QR. Contact data never leaves the app.
