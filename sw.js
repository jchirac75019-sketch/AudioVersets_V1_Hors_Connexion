const CACHE = 'quiz-coran-v1';

const CORE = [
  '/AudioVersets_V1_Hors_Connexion/',
  '/AudioVersets_V1_Hors_Connexion/index.html',
  '/AudioVersets_V1_Hors_Connexion/style.css',
  '/AudioVersets_V1_Hors_Connexion/data/verses.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE).catch(err => console.log('Cache error:', err)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  // ✅ IMPORTANT : Intercepter TOUS les fichiers locaux
  if(url.origin === location.origin && url.pathname.includes('/AudioVersets_V1_Hors_Connexion/')) {
    e.respondWith(
      caches.match(e.request)
        .then(cached => {
          // Si en cache → retourner le cache
          if(cached) {
            console.log('📦 Cache hit:', e.request.url);
            return cached;
          }
          
          // Sinon → fetch et mettre en cache
          return fetch(e.request)
            .then(response => {
              if(!response || response.status !== 200 || response.type === 'error') {
                return response;
              }
              
              // Mettre EN CACHE la réponse
              const clone = response.clone();
              caches.open(CACHE).then(c => {
                c.put(e.request, clone);
                console.log('💾 Cached:', e.request.url);
              });
              return response;
            })
            .catch(() => {
              // Hors ligne et pas en cache
              console.warn('❌ Offline et pas en cache:', e.request.url);
              return new Response('Offline - Not cached', { status: 503 });
            });
        })
    );
  } else {
    e.respondWith(fetch(e.request).catch(() => new Response('Offline')));
  }
});
