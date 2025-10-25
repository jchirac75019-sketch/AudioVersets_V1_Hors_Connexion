// sw.js

const CACHE = 'quiz-coran-v1';

const CORE = [
  '/',
  '/AudioVersets_V1_Hors_Connexion/',
  '/AudioVersets_V1_Hors_Connexion/index.html',
  '/AudioVersets_V1_Hors_Connexion/style.css'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE && caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
