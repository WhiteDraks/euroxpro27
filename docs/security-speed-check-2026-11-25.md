# Security and speed check — 25 November 2026

Scope: the website (euroxpro27.vercel.app) and the delegate app
(app-mobile-murex.vercel.app), with the features added in PR #60
(personal programme, announcements by country, QR business card).
Earlier reports (`app-language-security-2026-11-24.md`,
`test-report-2026-11-24.md`) are not repeated here.

## Fixed in this change

| Area | Problem | Fix |
| --- | --- | --- |
| App, Explorer Quest | Reward claims read the balance, then wrote it back. Several claims sent at the same moment (a double tap, or a script) could all see the same balance and spend the points more than once. Check-ins and the organizer "handed over" toggle had the same lost-update risk. | Claims, check-ins and the organizer toggle now run under a short per-person lock in Redis (`dlock:qst:<id>`, 10 s). A second request at the same moment gets "busy, try again" (new `err_busy` text in TR/EN/PL). |
| App, account delete | Deleting an account left its id in each starred session's `dplanby:<session>` set. | Delete now removes it from those sets. |
| App, opening speed | The service worker waited for the network before showing the app on every open. On crowded venue Wi-Fi this could mean several seconds of a white screen. | The saved app shell opens at once and a fresh copy is fetched in the background. Releases still arrive as before (SW `VERSION` bump, reload on `controllerchange`). SW v31. |
| Website, home page | The moving grid under the home title animated `background-position` on a wide 3D layer, which repainted it every frame. | The lines now move with a GPU transform (`.grid-floor::before`). Same look. On an emulated slow phone, main-thread work while the home page sits open fell from about 1.0–1.2 s to about 0.25–0.3 s per 5 s. |

## Checked, no problem found

- **Dependencies**: `npm audit` reports 0 vulnerabilities (site and app).
- **Secrets**: no keys or tokens in the commits since 22 November.
- **Authorization**: every organizer route checks the role on the server;
  delegates only reach their own requests, reservations, contacts and programme.
- **QR card**: card codes are 72-bit random, scanning is limited to 60 per
  hour, blocked people and hidden accounts cannot be saved, and card fields are
  hidden from someone you blocked. Phone, Instagram and LinkedIn are validated
  before saving and links are built with `encodeURIComponent`.
- **Announcements by country**: delegates only receive the ones for their
  country, both in the list, in sync and in push.
- **XSS**: the app never puts user text into HTML (only fixed icons and QR
  SVGs); the CSP blocks inline scripts. Team links are validated on the server.
- **Website**: fully static except admin and `/api/league`; admin upload checks
  file signatures; CSP and security headers are in place.

## Speed measurements

- Website pages answer from the Vercel CDN in 60–450 ms from Türkiye, about
  10–13 KB compressed HTML each. Lighthouse (mobile, local build): home about
  80, congress about 91. The rest of the home score is React start-up time;
  the countdown digits count as the "largest paint" once the page is
  interactive, which is a measuring quirk rather than something people see.
- App API calls take about 170–230 ms from Türkiye. Almost all of that is the
  distance: the function runs in Washington (`iad1`) while visitors reach
  Vercel through Frankfurt. The Redis database looks to be in the US too:
  calls that read it (`/api/me`) are as fast as one that does not (`/api/health`).

## Recommendation (needs an account change, not code)

Before the congress, moving the app's function and its Redis database to
Europe would cut every app request by roughly 100–150 ms for delegates in
Türkiye. That means creating an Upstash database in `eu-central-1`
(Frankfurt), copying the data, and setting `"regions": ["fra1"]` in
`app-mobile/vercel.json`. Moving only the function without the database would
make the app slower, because each request makes several database calls.
