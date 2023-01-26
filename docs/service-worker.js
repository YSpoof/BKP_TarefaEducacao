importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');
const version = '20231230092444';
const zCacheFirst = new workbox.strategies.CacheFirst({cacheName: 'cache', plugins: [ new workbox.expiration.ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 }) ]})
const zNetworkOnly = new workbox.strategies.NetworkOnly();

console.log("Service Worker version: " + version);

workbox.core.skipWaiting();
workbox.core.clientsClaim();

// use workbox to serve the page '/offline/' if the user is offline
const offlinePage = '/offline.html';
const matcher = ({event}) => event.request.mode === 'navigate';
const handler = async (args) => {
  try {
    return await zCacheFirst.handle(args);
  } catch (error) {
    return caches.match(offlinePage);
  }
};
workbox.routing.registerRoute(matcher, handler);

// register routes to not cache the update page and its assets
workbox.routing.registerRoute(({url}) => url.pathname.startsWith('/update/'), zNetworkOnly)
workbox.routing.registerRoute(({url}) => url.pathname.startsWith('/assets/js/update-handler.min.js'), zNetworkOnly)
workbox.routing.registerRoute(({url}) => url.pathname.startsWith('/assets/js/update-page.min.js'), zNetworkOnly)
workbox.routing.registerRoute(({url}) => url.pathname.startsWith('/fullsite.json'), zNetworkOnly)


workbox.routing.registerRoute(/.*/, zCacheFirst);