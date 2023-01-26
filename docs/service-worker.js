const swConfig = {
  cacheName: "cache",
  log: false,
};

let luluzinhaAssets = [
  "angry.svg",
  "dizzy-premium.svg",
  "dizzy.svg",
  "happy.svg",
  "hello-premium.svg",
  "hello.svg",
  "neutral.svg",
  "sad-premium.svg",
  "sad.svg",
  "thinking-premium.svg",
  "thinking.svg",
];

luluzinhaAssets = luluzinhaAssets.map((e) => `/assets/images/luluzinha/${e}`);

const pages = ["/", "/offline.html", "/404.html", "/game.html"];

let assets = [
  "/assets/css/theme.css",
  "/assets/images/logo.webp",
  "/assets/images/logo-premium.webp",
  ...luluzinhaAssets,
];

const scripts = [
  "/assets/js/workers/search-worker.js?v=gambiarra",
  "/assets/js/router.js?v=gambiarra",
  "/assets/js/main.js?v=gambiarra",
];

const appContent = [...pages, ...assets, ...scripts];

// Event Handlers

self.addEventListener("install", (event) => {
  swConfig.log && console.log("🚀 Deploy update to cache");
  event.waitUntil(
    caches.open(swConfig.cacheName).then((cache) => {
      return Promise.allSettled(appContent.map((url) => cache.add(url))).then(
        (results) => {
          results.forEach((result) => {
            if (result.status === "rejected") {
              swConfig.log &&
                console.warn(`Failed to cache some assets: ${result.reason}`);
            }
          });
        }
      );
    })
  );
  self.skipWaiting();
  swConfig.log && console.log("✨ Service Worker installed");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration?.navigationPreload.enable());
  swConfig.log && console.log("✅ Service Worker activated");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(staleRevalidate(event));
});

// Close all tabs on request "closeAllTabs", we should ignore the client that requested it
self.addEventListener("message", (event) => {
  if (event.data === "closeAllTabs") {
    clients.matchAll({ includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => {
        if (client.id !== event.source.id) {
          client.navigate("https://lzart.com.br");
        }
      });
    });
  }
});

// Functions

async function staleRevalidate(event) {
  let request = event.request;
  let cache = await caches.open(swConfig.cacheName);

  // Serve the cached response immediately if it exists
  let cachedResponse = await cache.match(request);

  if (cachedResponse) {
    swConfig.log && console.log("🚀 Serving from cache", request.url);
    // Update the cache in the background
    event.waitUntil(
      fetch(request, { cache: "no-store" })
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            swConfig.log && console.log("🌠 Updating cache", request.url);
            await cache.put(request, networkResponse.clone());
          }
        })
        .catch((errors) => {
          console.warn("Error updating cache", errors);
        })
    );
    return cachedResponse;
  }

  // If no cached response, fetch from network
  let preloadResponse = navigator.onLine ? await event.preloadResponse : null;
  let onlineResponse = navigator.onLine
    ? (preloadResponse ? Promise.resolve(preloadResponse) : fetch(request))
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(
          () =>
            new Response("Something went wrong", {
              status: 408,
              headers: { "Content-Type": "text/plain" },
            })
        )
    : caches.match("/offline.html");

  return onlineResponse;
}
