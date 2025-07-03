// sw.js - Service Worker v7 (Estratégia Híbrida: App Shell + Stale-While-Revalidate Dinâmico)

// IMPORTANTE: Altere a versão a cada grande alteração para forçar a atualização!
const CACHE_NAME = 'manutencao-industrial-cache-v7';

// A "casca" da aplicação: apenas os ficheiros absolutamente essenciais para o site arrancar.
const APP_SHELL_URLS = [
  '/site/', // A raiz do site
  '/site/index.html',
  '/site/style.css',
  '/site/script.js',
  '/site/manifest.json',
  '/site/images/icon-512x512.png' // O ícone principal
];

// Evento de Instalação: Guarda apenas o App Shell em cache.
self.addEventListener('install', event => {
  console.log('[Service Worker] A instalar...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] A guardar o App Shell em cache');
        return cache.addAll(APP_SHELL_URLS);
      })
      .catch(error => {
        console.error('Falha ao guardar o App Shell em cache:', error);
      })
  );
});

// Evento de Ativação: Limpa caches antigos para manter tudo atualizado.
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
  return self.clients.claim();
});

// Evento de Fetch: Stale-While-Revalidate para todos os pedidos GET.
self.addEventListener('fetch', event => {
  // Ignora pedidos que não são GET (ex: POST)
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request)
        .then(cachedResponse => {
          // Faz o pedido à rede em paralelo (em background)
          const fetchPromise = fetch(event.request).then(
            networkResponse => {
              // Se o pedido à rede for bem-sucedido, atualiza o cache
              if (networkResponse.status === 200) {
                  cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            }
          ).catch(err => {
            console.error('[Service Worker] Erro no fetch:', err);
          });

          // Retorna a resposta do cache imediatamente se existir (para performance)
          // Se não existir, espera pela resposta da rede.
          return cachedResponse || fetchPromise;
        });
    })
  );
});
