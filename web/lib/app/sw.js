const cacheName = 'insightful';

self.addEventListener('install', event => {
  console.log('SW: install');
  event.waitUntil(
    new Promise(async resolve => {
      const manifest = await (await fetch('/static/webpack.json')).json();
      const assets = Object.values(manifest).filter(e => e != '/static/sw.js');
      assets.push('/');
      const cache = await caches.open(cacheName);
      resolve(await cache.addAll(assets));
    })
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
