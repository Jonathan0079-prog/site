// sw.js - Service Worker v6 (Cache First + Atualização em Background)

const CACHE_NAME = 'manutencao-industrial-cache-v6'; // Atualize a versão a cada alteração!
const APP_SHELL_URLS = [
  '/index.html',
  '/style.css',
  '/images/icon-512x512.png'
];

// Instalação: cacheia arquivos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL_URLS))
  );
});

// Ativação: limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName =>
          cacheName !== CACHE_NAME ? caches.delete(cacheName) : null
        )
      )
    )
  );
});

// Fetch: Cache First + atualização em background
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Atualiza o cache em segundo plano
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse); // Se offline, retorna o cache

      // Retorna o cache imediatamente, e dispara a atualização em background
      return cachedResponse || fetchPromise;
    })
  );
});
