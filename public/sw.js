// Deluxe Saloon — service worker
// Just enough caching to (a) satisfy Chrome's "installable" requirement
// and (b) let the shell load fast / offline.
//
// IMPORTANT: bump CACHE_VERSION every time you change index.html,
// manifest.json, or any icon file, so old installs pick up the
// update instead of serving a stale cached copy.
const CACHE_VERSION = 'deluxe-saloon-v2';
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/icon-512-maskable.png',
  '/img/favicon.png'
];

// URLs that must ALWAYS be re-checked against the network first —
// these are the files Chrome reads to decide the app's name/icon/
// install eligibility, so a stale cached copy here is what causes
// "wrong name" / "old icon" bugs after an update.
const NETWORK_FIRST_PATHS = [
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/icon-512-maskable.png',
  '/img/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never intercept YouTube / analytics / third-party API calls —
  // just let those go straight to the network as normal.
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Network-first for the HTML shell so users always get fresh content
  // when online, falling back to cache when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put('/', clone));
          return res;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Network-first for manifest.json and icons — these control the
  // app's install name/icon, so they must never be served stale.
  if (NETWORK_FIRST_PATHS.includes(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for everything else (static assets not tied to install identity).
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req)
          .then((res) => {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
            return res;
          })
          .catch(() => cached)
      );
    })
  );
});
