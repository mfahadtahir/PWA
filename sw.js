var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    './',
    './index.html'
];
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});
self.addEventListener('fetch', function (e) {
    if (e.request.url.startsWith("https://fyld")) {
      e.respondWith(
        caches.open('dynamicCache').then(function (cache) {
          return fetch(e.request).then(function (response) {
            cache.put(e.request, response.clone());
            return response;
          })
        })
      );
    }
  else {
      e.respondWith(
        caches.match(e.request).then(function (response) {
          return response || fetch(e.request);
        })
      );
    };
  });