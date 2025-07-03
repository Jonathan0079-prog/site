// sw.js - Service Worker v4 (Caminhos Relativos e Estratégia Robusta)

const CACHE_NAME = 'manutencao-industrial-cache-v4'; // ATUALIZE A VERSÃO para forçar a atualização

// Lista de ficheiros essenciais. Usar caminhos relativos torna o PWA mais flexível.
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './programas/index.html',
  './programas/LMS-SOFTWARE/index.html',
  './programas/torque parafusos/index.html',
  // Adicione aqui os caminhos para as OUTRAS páginas HTML que quer que funcionem offline
  './images/icon-512x512.png'
];

// Evento de Instalação: Guarda os ficheiros essenciais em cache.
self.addEventListener('install', event => {
  console.log('[Service Worker] A instalar...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] A guardar ficheiros essenciais em cache');
        return cache.addAll(urlsToCache);
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

// Evento de Fetch: Estratégia "Cache-First" (Cache Primeiro) para máxima velocidade offline.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o recurso estiver no cache, retorna-o.
        if (response) {
          return response;
        }
        // Se não, vai à rede para o buscar.
        return fetch(event.request).then(
          networkResponse => {
            // E guarda a resposta em cache para a próxima vez.
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
        );
      })
  );
});
