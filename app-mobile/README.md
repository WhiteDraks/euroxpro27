# EUROXPRO'27 Delegate App (PWA)

A separate web app for delegates that can be added to the home screen. It lives in the same repo as the website, but it is **its own Vercel project with its own address**. The website is not affected.

- **Live agenda:** a "Now / Up next" card, a day picker and a countdown before the congress. Organizers can mark a session delayed, moved or cancelled and add a note, and every open phone sees the change within a few seconds.
- **Map:** the airport, bus station, Kaleiçi and beaches in Antalya, with directions in Apple Maps or Google Maps.
- **Meet:** Tinder-style cards. Swipe right to like, left to pass. When two people like each other it's a match and a private chat opens.
- **Plenary:** an empty hall where small avatars of everyone signed in (last 30 seconds) wander around. Tap someone to message them.
- **Profile:** emoji avatar, short bio (translated for the reader), and a switch to show or hide yourself in Meet.
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
   - `DEEPL_API_KEY` (recommended): a DeepL API Free key, which gives 500k characters a month at no cost. Without it, the free MyMemory service is used, and it has a daily limit.
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
