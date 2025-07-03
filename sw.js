// sw.js - Service Worker v5 (Estratégia Definitiva: Network First, Falling Back to Cache)

// IMPORTANTE: Altere a versão para forçar a atualização no navegador do utilizador!
const CACHE_NAME = 'manutencao-industrial-cache-v5'; 

// Ficheiros essenciais do "App Shell" - o mínimo para a aplicação arrancar.
const APP_SHELL_URLS = [
  '/site/index.html',
  '/site/style.css',
  '/site/images/icon-512x512.png' // Apenas o essencial para o arranque
];

// Evento de Instalação: Guarda apenas o mínimo necessário em cache.
self.addEventListener('install', event => {
  console.log('[Service Worker] A instalar...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] A guardar o App Shell em cache');
      return cache.addAll(APP_SHELL_URLS);
    })
  );
});

// Evento de Ativação: Limpa caches com nomes antigos.
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

// Evento de Fetch: Esta é a nova estratégia, mais segura.
self.addEventListener('fetch', event => {
  event.respondWith(
    // 1. Tenta primeiro obter da rede (online-first).
    fetch(event.request)
      .then(networkResponse => {
        // Se a rede funcionou, guardamos uma cópia em cache para uso offline.
        return caches.open(CACHE_NAME).then(cache => {
          // Apenas guarda em cache pedidos GET bem-sucedidos.
          if (event.request.method === 'GET') {
            cache.put(event.request, networkResponse.clone());
          }
          // E retorna a resposta da rede para o utilizador ver a página completa.
          return networkResponse;
        });
      })
      // 2. Se a rede falhar (está offline), o .catch é ativado.
      .catch(() => {
        console.log(`[Service Worker] Falha na rede. A tentar obter do cache: ${event.request.url}`);
        // Tenta encontrar uma correspondência no cache.
        return caches.match(event.request);
      })
  );
});
