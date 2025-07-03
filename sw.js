// sw.js - Service Worker v6 (Cache First + Atualização em Background)

const CACHE_NAME = 'manutencao-industrial-cache-v6'; // Atualize a versão a cada alteração!
const APP_SHELL_URLS = [
  '/index.html',
  '/style.css',
  '/images/icon-512x512.png',
  '/programas/index.html',
  '/programas/style.css',
  '/programas/script.js',

  // Calculadora para Correias Transportadoras
  '/programas/Calculadora para Correias Transportadoras/index.html',
  '/programas/Calculadora para Correias Transportadoras/script.js',
  '/programas/Calculadora para Correias Transportadoras/style.css',

  // Conversor de Escalas Lineares
  '/programas/Conversor de Escalas Lineares/index.html',
  '/programas/Conversor de Escalas Lineares/script.js',
  '/programas/Conversor de Escalas Lineares/style.css',

  // LMS-SOFTWARE
  '/programas/LMS-SOFTWARE/calculadora.html',
  '/programas/LMS-SOFTWARE/index.html',
  '/programas/LMS-SOFTWARE/mistura.html',
  '/programas/LMS-SOFTWARE/plano.html',
  '/programas/LMS-SOFTWARE/style.css',

  // calculadora de montagem de rolamentos
  '/programas/calculadora de montagem de rolamentos/index.html',
  '/programas/calculadora de montagem de rolamentos/style.css',

  // calculadora polias
  '/programas/calculadora polias/index.html',
  '/programas/calculadora polias/script.js',
  '/programas/calculadora polias/style.css',

  // calculadora quantidade e frequência de graxa
  '/programas/calculadora quantidade e frequência de graxa/index.html',
  '/programas/calculadora quantidade e frequência de graxa/script.js',
  '/programas/calculadora quantidade e frequência de graxa/style.css',

  // conversor de unidades
  '/programas/conversor de unidades/index.html',
  '/programas/conversor de unidades/script.js',
  '/programas/conversor de unidades/style.css',

  // relacao engrenagens
  '/programas/relacao engrenagens/index.html',
  '/programas/relacao engrenagens/script.js',
  '/programas/relacao engrenagens/style.css',

  // torque parafusos
  '/programas/torque parafusos/index.html',
  '/programas/torque parafusos/script.js',
  '/programas/torque parafusos/style.css'
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
