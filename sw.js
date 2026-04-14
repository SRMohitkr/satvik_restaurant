const CACHE_NAME = "satvik-static-v1";
const OFFLINE_ASSETS = [
  "/",
  "/index.html",
  "/menu.html",
  "/cabins.html",
  "/reviews.html",
  "/assets/css/styles.css",
  "/assets/js/app.js",
  "/assets/img/logo.jpg",
  "/assets/img/interior-1.jpg",
  "/assets/img/interior-2.jpg",
  "/assets/img/interior-wide.jpg",
  "/assets/img/hero-restaurant.jpg",
  "/assets/img/dish-dal.jpg",
  "/assets/img/table-spread.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (!response.ok || response.type !== "basic") return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("index.html"));
    })
  );
});
