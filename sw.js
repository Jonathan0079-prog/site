// sw.js - Service Worker com Cache Dinâmico

const CACHE_NAME = 'industrial-site-cache-v1';

// O "App Shell" - ficheiros essenciais para o arranque inicial
const appShellFiles = [
  '/site/',
  '/site/index.html',
  '/site/style.css',
  '/site/script.js',
  '/site/images/icon-512x512.png'
];

// Evento de Instalação: Guarda o App Shell em cache.
self.addEventListener('install', event => {
  console.log('[Service Worker] A instalar...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] A guardar o App Shell em cache');
      return cache.addAll(appShellFiles);
    })
  );
});

// Evento de Ativação: Limpa caches antigos.
self.addEventListener('activate', event => {
  console.log('[Service Worker] A ativar...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] A limpar cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de Fetch: Intercepta os pedidos e serve do cache se a rede falhar.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Estratégia: Tenta primeiro a rede, se falhar, vai ao cache.
    fetch(event.request)
      .then(networkResponse => {
        // Se a rede funcionou, guarda a nova versão em cache para a próxima vez
        return caches.open(CACHE_NAME).then(cache => {
          if(event.request.method === 'GET') {
             cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Se a rede falhou (offline), tenta encontrar no cache
        console.log(`[Service Worker] Falha na rede. A procurar no cache: ${event.request.url}`);
        return caches.match(event.request);
      })
  );
});
