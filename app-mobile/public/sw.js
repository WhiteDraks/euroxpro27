// EUROXPRO'27 app — offline support.
// The app shell is saved on install so the app opens without internet.
// API calls always go to the network; map tiles are kept in a small cache.
const VERSION = "v4";
const SHELL = `app-shell-${VERSION}`;
const TILES = `app-tiles-${VERSION}`;
const MAX_TILES = 300;

const SHELL_FILES = [
  "/",
  "/index.html",
  "/app.css",
  "/app.js",
  "/i18n.js",
  "/places.js",
  "/theme-init.js",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/vendor/leaflet/leaflet.js",
  "/vendor/leaflet/leaflet.css",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("app-") && ![SHELL, TILES].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trimTiles() {
  const c = await caches.open(TILES);
  const keys = await c.keys();
  for (const k of keys.slice(0, Math.max(0, keys.length - MAX_TILES))) await c.delete(k);
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.hostname.endsWith("basemaps.cartocdn.com")) {
    e.respondWith(
      caches.open(TILES).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok || res.type === "opaque") {
          c.put(req, res.clone());
          trimTiles();
        }
        return res;
      })
    );
    return;
  }

  if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;

  // Pages: always the app shell (client-side routing), fresh when online.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) caches.open(SHELL).then((c) => c.put("/index.html", res.clone()));
          return res;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Static files: serve saved copy at once, refresh it in the background.
  e.respondWith(
    caches.open(SHELL).then(async (c) => {
      const hit = await c.match(req);
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok) c.put(req, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
