const precacheResources = ['/', '/library', 'index.html', '/static/main.js'];
const cacheName = 'cache-11';

self.addEventListener('install', event => {
  console.log('SW: install');
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(precacheResources))
  );
});

self.addEventListener('activate', event => console.log('SW: activate'));

self.addEventListener('fetch', event => {
  console.log('SW: fetch', event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then(cachedResponse =>
        cachedResponse ? cachedResponse : fetch(event.request)
      )
  );
});
