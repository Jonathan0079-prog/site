// sw.js - Service Worker (Estratégia Dinâmica)

const CACHE_NAME = 'sgl-cache-v1';
// Lista de ficheiros essenciais para o funcionamento base.
// Os caminhos devem corresponder à estrutura no seu servidor GitHub Pages.
const appShellFiles = [
  '/site/',
  '/site/index.html',
  '/site/calculadora.html',
  '/site/plano.html',
  '/site/mistura.html',
  '/site/style.css',
  '/site/data/database.js',
  '/site/js/script.js',
  '/site/js/calculadora.js',
  '/site/js/plano.js',
  '/site/js/mistura.js',
  '/site/images/icon-192x192.png',
  '/site/images/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js'
];

// Evento de Instalação: Guarda o App Shell em cache.
self.addEventListener('install', event => {
  console.log('[Service Worker] A instalar...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] A guardar o App Shell em cache');
        return cache.addAll(appShellFiles).catch(error => {
          console.error('Falha ao guardar ficheiros em cache durante a instalação:', error);
        });
      })
  );
});

// Evento de Ativação: Limpa caches antigos.
self.addEventListener('activate', event => {
  console.log('[Service Worker] A ativar...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] A limpar cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de Fetch: Intercepta os pedidos.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Estratégia: Cache primeiro, depois rede. Ideal para performance offline.
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna a resposta do cache.
        if (response) {
          return response;
        }
        // Se não, faz o pedido à rede.
        return fetch(event.request);
      })
  );
});
