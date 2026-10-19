const CACHE_NAME = 'ai-assistant-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/static/ai_assistant/css/style.css',
    '/static/ai_assistant/js/app.js',
    '/static/ai_assistant/manifest.json'
];

// Install Event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch Event (Cache-first fallback strategy)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request).catch(() => {
                if (e.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});