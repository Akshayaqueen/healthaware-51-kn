const CACHE_NAME = "healthaware-v1"
const urlsToCache = [
  "/",
  "/ai-radio",
  "/comics",
  "/myth-buster",
  "/healthcare-info",
  "/sign-in",
  "/sign-up",
  "/manifest.json",
]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})
