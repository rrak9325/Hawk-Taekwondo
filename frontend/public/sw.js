// Simple service worker for caching static assets
const CACHE_NAME = 'hawk-taekwondo-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/assets/hawk-taekwondo-logo.png',
  // Add other critical assets here
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})