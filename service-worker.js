const CACHE_VERSION = 'luscher-v20'; // Обязательно подняли версию!
const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png',
    './icons/apple-touch-icon.png',
];

// Установка — кэшируем оболочку безопасно
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => {
                // Загружаем каждый файл отдельно. Если иконки нет — это не сломает весь процесс.
                return Promise.allSettled(
                    APP_SHELL.map(url => cache.add(url))
                );
            })
            .then(() => self.skipWaiting())
    );
});

// Активация — чистим старые версии кэша
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch — стратегия: cache-first для своих файлов, network для остального
self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;

            return fetch(request).then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
                }
                return response;
            }).catch(() => {
                if (request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
