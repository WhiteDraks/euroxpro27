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
5. **Deployments → Redeploy.** The app is now live at an address like `euroxpro27-app.vercel.app`. You can also add a domain such as `app.euroxpro27.com`.

After that, every merge to `main` deploys automatically. Until Redis is connected, the app opens but sign-up shows a "still being set up" message.

## Structure

```
public/          The app itself (index.html, app.js, app.css, i18n.js, places.js, sw.js)
api/index.js     Vercel function: every /api/* request comes here
lib/api.js       Accounts, agenda, messages, sync
lib/kv.js        Upstash Redis (REST); memory when no env vars are set
lib/translate.js DeepL / LibreTranslate / MyMemory
lib/agenda-seed.js The first agenda (taken from the website's draft programme)
dev-server.js    Local testing, or running on any Node host
```

Live updates come from the app calling `/api/sync` every 4 seconds while it is on screen. When nothing has changed, that costs one Redis read.

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
- **World map** `/world`, plenary heat layer, **recap story** `/recap` (shareable 1080×1920 PNG), **sunset theme** 17:00–21:00 Antalya time, confetti on matches, check-ins and rewards.
