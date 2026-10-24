// BCNTA Followers - service worker : l'appli s'ouvre même sans réseau, et se met à jour dès qu'une nouvelle version est en ligne.
const CACHE = 'bcnta-v1';
const FICHIERS = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin) return; // jamais les appels vers le script Google : ils passent directement
  e.respondWith(fetch(r).then(res => { const copie = res.clone(); caches.open(CACHE).then(c => c.put(r, copie)); return res; }).catch(() => caches.match(r).then(x => x || caches.match('index.html'))));
});
