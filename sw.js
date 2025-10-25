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
  const url = new URL(e.request.url);
  
  // Pour TOUS les fichiers de notre domaine (HTML, CSS, MP3, JSON)
  if(url.origin === location.origin){
    e.respondWith(
      caches.match(e.request).then(r => {
        if(r) return r; // Retourne depuis le cache
        
        return fetch(e.request).then(res => {
          // Mets en cache TOUS les fichiers (y compris MP3)
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        }).catch(() => {
          // Si fetch échoue, retourne index.html
          return caches.match('/AudioVersets_V1_Hors_Connexion/index.html');
        });
      })
    );
  } else {
    // Pour les requêtes externes
    e.respondWith(
      fetch(e.request).catch(()=>caches.match(e.request))
    );
  }
});
