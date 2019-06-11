self.addEventListener('install', event => {
  const evt = event as any;
  console.log('SW: install', evt);

  evt.waitUntil(async () => {
    // Download webpack assets manifest
    const manifest: { [x: string]: string } = await fetch(
      '/static/webpack.json'
    ).then(res => res.json());
    const assets = Object.values(manifest).filter(e => e != '/static/sw.js');
    console.log('assets', assets);

    // Cache the homepage
    assets.push('/');

    // Cache all assets
    const cache = await caches.open('insightful');
    await cache.addAll(assets);
    console.log('cached');
    return;
  });
});

self.addEventListener('activate', () => console.log('SW: activate'));

self.addEventListener('fetch', event => {
  const evt = event as any;
  console.log('SW: fetch', evt.request.url);

  // Load response from cache if available, else load from network
  evt.respondWith(
    caches
      .match(evt.request)
      .then(cachedResponse =>
        cachedResponse ? cachedResponse : fetch(evt.request)
      )
  );
});
