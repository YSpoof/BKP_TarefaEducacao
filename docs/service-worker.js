const swConfig = {
  cacheName: "cache",
  log: true,
};

let mascotAssets = [
  "dizzy.png",
  "happy.png",
  "lost.png",
  "rage.png",
  "scared.png",
  "sleepy.png",
  "stop.png",
  "studying.png",
];

mascotAssets = mascotAssets.map((e) => `/assets/images/mascot/${e}`);

const pages = ["/", "/offline.html", "/404.html", "/game.html"];

let assets = [
  "/assets/css/theme.css",
  "/assets/images/logo.webp",
  "/assets/images/logo-premium.webp",
  ...mascotAssets,
];

const scripts = [
  "/assets/js/workers/search-worker.js",
  "/assets/js/router.js",
  "/assets/js/main.js",
];

const networkOnlyUrls = ["/reset.html", "/sitemap.xml", "/robots.txt"];

const appContent = [...pages, ...assets, ...scripts];

// Event Handlers

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        await caches.delete(swConfig.cacheName);
        const cache = await caches.open(swConfig.cacheName);
        const results = await Promise.allSettled(
          appContent.map((url) => cache.add(url))
        );
        results.forEach((result) => {
          if (result.status !== "fulfilled") {
            console.warn("❌ Error caching:", result.reason);
          }
        });
      } catch (error) {
        console.error("❌ Error in service worker:", error);
      }
    })()
  );
  self.skipWaiting();
  swConfig.log && console.log("✨ Service Worker installed");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration?.navigationPreload.enable());
  swConfig.log && console.log("✅ Service Worker activated");
});

self.addEventListener("fetch", (event) => {
  if (networkOnlyUrls.includes(new URL(event.request.url).pathname)) {
    console.log(`🛰️ Serving from network: ${event.request.url}`);
    return;
  }

  event.respondWith(staleRevalidate(event));
});

// Close all tabs on request "closeAllTabs", we should ignore the client that requested it
self.addEventListener("message", (event) => {
  if (event.data === "closeAllTabs") {
    clients.matchAll({ includeUncontrolled: true }).then((browserWindows) => {
      browserWindows.forEach((browserWindow) => {
        if (browserWindow.id !== event.source.id) {
          browserWindow.navigate("https://lzart.com.br");
        }
      });
    });
  }
});

// Functions

async function staleRevalidate(event) {
  let request = event.request;

  // Only cache GET requests
  if (request.method !== "GET") {
    return fetch(request, { redirect: "follow" });
  }

  let cache = await caches.open(swConfig.cacheName);

  // Serve the cached response immediately if it exists
  let cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Update the cache in the background
    event.waitUntil(
      fetch(request, { cache: "no-store", redirect: "follow" })
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            if (!networkResponse.redirected) {
              await cache.put(request, networkResponse.clone());
            }
          }
        })
        .catch((errors) => {
          console.warn("Error updating cache", errors);
        })
    );
    swConfig.log && console.log("🚀 Serving from cache:", request.url);
    return cachedResponse;
  }

  // If no cached response, fetch from network
  try {
    let preloadResponse = navigator.onLine ? await event.preloadResponse : null;
    let networkResponse =
      preloadResponse ||
      (navigator.onLine ? await fetch(request, { redirect: "follow" }) : null);

    if (networkResponse && networkResponse.ok) {
      if (!networkResponse.redirected) {
        await cache.put(request, networkResponse.clone());
      }
      swConfig.log &&
        console.log(`🛰️ Serving from network: ${event.request.url}`);
      return networkResponse;
    } else if (networkResponse && networkResponse.status === 404) {
      let notFoundResponse =
        (await caches.match("/404.html")) || fetch("/404.html");
      return notFoundResponse || new Response("404 Not Found", { status: 404 });
    }
  } catch (error) {
    console.warn("Network error:", error);
  }

  // If no network response, return offline page
  let offlineResponse = await caches.match("/offline.html");
  return offlineResponse || new Response("Network Error", { status: 400 });
}
