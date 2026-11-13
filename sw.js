// Setlist app — offline cache and auto-update.
// Bump VERSION on every release: the browser sees the change when the app
// opens online, installs the new files, and the page refreshes itself.
const VERSION = '1.3.0';
const CACHE = 'hsd-app-' + VERSION;
const FONT_CACHE = 'hsd-fonts';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('hsd-app-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fonts: keep a copy so lyrics look the same offline.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT_CACHE).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); c.put(req, res.clone()); return res; } catch (err) { return Response.error(); }
    }));
    return;
  }

  // The app itself: served from the saved copy so it opens with no signal.
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit ||
      fetch(req).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error())));
  }
  // Everything else (GitHub sync) goes straight to the network.
});
