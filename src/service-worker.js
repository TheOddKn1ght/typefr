import { build, files, version } from '$service-worker';

const CACHE = `typefr-cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE);
        if (ASSETS.includes(url.pathname)) {
            const hit = await cache.match(url.pathname);
            if (hit) return hit;
        }
        try {
            const res = await fetch(event.request);
            if (res.status === 200) cache.put(event.request, res.clone());
            return res;
        } catch {
            const hit = await cache.match(event.request);
            if (hit) return hit;
            return (await cache.match('/')) ?? Response.error();
        }
    })());
});
