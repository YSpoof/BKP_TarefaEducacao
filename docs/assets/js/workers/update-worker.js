const urlsToRemoveFromCache = [
  "/401.html",
  "/403.html",
  "/feed.xml",
  "/fullsite.json",
  "/google25008c19ca68a028.html",
  "/robots.txt",
  "/sitemap.xml",
  "/robots.txt",
  "/debug/",
  "/reset.html",
];

const extras = [
  "/assets/images/logo.webp",
  "/assets/images/logo-premium.webp",
  "/assets/css/theme.css",
  "/offline.html",
  "/assets/js/workers/search-worker.js",
];

const mascotAssets = [
  "dizzy.png",
  "happy.png",
  "lost.png",
  "rage.png",
  "scared.png",
  "sleepy.png",
  "stop.png",
  "studying.png",
];

async function letsUpdate() {
  const response = await fetch("/fullsite.json", { cache: "no-store" });
  const data = await response.json();

  let siteStuff = new Set(data);

  urlsToRemoveFromCache.forEach((e) => siteStuff.delete(e));

  extras.forEach((e) => siteStuff.add(e));

  mascotAssets.forEach((e) => siteStuff.add(`/assets/images/mascot/${e}`));

  console.log(`Cache size -> ${siteStuff.size}`);

  postMessage({ size: siteStuff.size });

  const cachePromises = Array.from(siteStuff).map(async (request) => {
    try {
      const response = await fetch(request, { cache: "no-store" });
      const cache = await caches.open("cache");
      await cache.put(request, response);
      console.log("Cached -> " + request);
      postMessage("increment");
    } catch (err) {
      console.warn(`Failed to cache -> ${request}. Error: ${err}`);
    }
  });

  await Promise.allSettled(cachePromises);

  console.log("Website cached");

  postMessage("done");
}

onmessage = (e) => {
  if (e.data == "letsUpdate") {
    setTimeout(() => letsUpdate(), 1000);
  }
};
