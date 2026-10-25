// ============================================================
// EUROXPRO'27 — offline support
// Pages are always fetched fresh when there is internet; the saved copy
// is only used when the network is down (or too slow to answer).
// The editor (/admin) and API routes are never cached.
// ============================================================

const VERSION = "v1";
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const IMAGES = `images-${VERSION}`;

// Saved in the background after the first visit, so every page opens offline.
const ROUTES = [
  "/",
  "/congress",
  "/explore-antalya",
  "/delegate-guide",
  "/faq",
  "/team",
  "/announcements",
  "/merch",
  "/contact",
];

const NETWORK_TIMEOUT_MS = 6000;
const MAX_IMAGES = 120;
const MAX_ASSETS = 200;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = [PAGES, ASSETS, IMAGES];
      for (const key of await caches.keys()) {
        if (!keep.includes(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "precache") event.waitUntil(precachePages(data.images || []));
});

async function precachePages(images) {
  // Respect the browser's data saver setting on slow or metered connections.
  if (self.navigator.connection && self.navigator.connection.saveData) return;
  // Photos the first page already downloaded (before this worker was running).
  const imageCache = await caches.open(IMAGES);
  for (const src of images.slice(0, 40)) {
    const url = new URL(src, self.location.origin);
    if (url.origin !== self.location.origin || (await imageCache.match(url.href))) continue;
    try {
      const response = await fetch(url.href);
      if (response.ok) await imageCache.put(url.href, response);
    } catch {
      break;
    }
  }
  const cache = await caches.open(PAGES);
  const assets = await caches.open(ASSETS);
  for (const route of ROUTES) {
    if (await cache.match(route)) continue;
    try {
      const response = await fetch(route, { credentials: "same-origin" });
      if (!response.ok) continue;
      await cache.put(route, response.clone());
      // Also save the page's scripts and styles so it stays interactive offline.
      const html = await response.text();
      const files = new Set(html.match(/\/_next\/static\/[^"'\s)]+\.(?:js|css)/g) || []);
      for (const file of files) {
        if (!(await assets.match(file))) {
          const asset = await fetch(file);
          if (asset.ok) await assets.put(file, asset);
        }
      }
    } catch {
      return; // Offline again; try on the next visit.
    }
  }
  trim(assets, MAX_ASSETS);
}

function isBypassed(url) {
  return (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api/") ||
    url.pathname === "/sw.js" ||
    url.searchParams.has("_rsc")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isBypassed(url)) return;
  // Client-side page data; if it fails, Next.js falls back to a full page load.
  if (request.headers.get("RSC")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(event, request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, ASSETS, MAX_ASSETS));
  } else if (
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/uploads/") ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(staleWhileRevalidate(event, request, IMAGES, MAX_IMAGES));
  }
});

// Fresh page from the network; the saved copy only when offline or very slow.
async function networkFirst(event, request) {
  const cache = await caches.open(PAGES);
  const key = new URL(request.url).pathname;
  const network = fetch(request).then((response) => {
    if (response.ok && response.type === "basic") {
      event.waitUntil(cache.put(key, response.clone()));
    }
    return response;
  });
  event.waitUntil(network.catch(() => {}));

  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS));
  try {
    const response = await Promise.race([network, timeout]);
    if (response) return response;
  } catch {
    // Offline: fall through to the saved copy.
  }
  const saved = await cache.match(key);
  if (saved) return saved;
  try {
    return await network;
  } catch {
    return offlinePage();
  }
}

async function cacheFirst(request, name, max) {
  const cache = await caches.open(name);
  const saved = await cache.match(request);
  if (saved) return saved;
  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
    trim(cache, max);
  }
  return response;
}

async function staleWhileRevalidate(event, request, name, max) {
  const cache = await caches.open(name);
  const saved = await cache.match(request);
  const network = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
        trim(cache, max);
      }
      return response;
    })
    .catch(() => undefined);
  if (saved) {
    event.waitUntil(network);
    return saved;
  }
  return (await network) || (await sameImageOtherSize(cache, request.url)) || Response.error();
}

// Offline, a photo saved at another width is better than a broken image.
async function sameImageOtherSize(cache, href) {
  const source = new URL(href).searchParams.get("url");
  if (!source) return undefined;
  for (const key of await cache.keys()) {
    if (new URL(key.url).searchParams.get("url") === source) return cache.match(key);
  }
  return undefined;
}

async function trim(cache, max) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

function offlinePage() {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline | EUROXPRO'27</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#101B35;color:#F7F3ED;font-family:system-ui,sans-serif;text-align:center;padding:24px">
<div><p style="letter-spacing:.2em;font-size:12px;color:#e58aa6;text-transform:uppercase">EUROXPRO'27 Antalya</p>
<h1 style="font-weight:400;font-size:28px;margin:12px 0">You are offline</h1>
<p style="color:#A7AFBF;max-width:360px;margin:0 auto 24px">This page has not been saved on your device yet. Reconnect to the internet and try again.</p>
<button onclick="location.reload()" style="background:#741F3D;color:#fff;padding:12px 20px;border:0;border-radius:2px;font-size:15px;cursor:pointer">Try again</button></div></body></html>`;
  return new Response(html, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
}
