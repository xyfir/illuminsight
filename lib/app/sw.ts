import pkg from '../../package.json';

const CACHE = `illuminsight-${pkg.version}`;
let assets: string[] = [];

self.addEventListener('install', event => {
  const evt = event as any;
  console.log('SW: install', evt);

  evt.waitUntil(
    (async () => {
      // Download webpack assets manifest
      const manifest: { [x: string]: string } = await fetch(
        '/webpack.json'
      ).then(res => res.json());
      assets = Object.values(manifest).filter(e => e != '/sw.js');

      // Cache the homepage
      assets.push('/');

      // Cache all assets
      const cache = await caches.open(CACHE);
      await cache.addAll(assets);
      return;
    })()
  );
});

self.addEventListener('activate', event => {
  const evt = event as any;
  console.log('SW: activate', evt);

  // Delete old cache entries not in current version's asset list
  evt.waitUntil(
    (async () => {
      let keys = await caches.keys();
      keys = keys.filter(key => key != CACHE);
      await Promise.all(keys.map(key => caches.delete(key)));
      console.log(`SW: clearing ${keys.length} entries from cache`);
    })()
  );
});

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
