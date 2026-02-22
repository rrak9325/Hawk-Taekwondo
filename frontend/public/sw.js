// Service worker - force clear old cache and always fetch fresh
const CACHE_VERSION = 'v3' // Increment this to force cache clear
const CACHE_NAME = `hawk-taekwondo-${CACHE_VERSION}`

// Install - clear all old caches
self.addEventListener('install', (event) => {
  console.log('Service Worker installing, clearing old caches...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.skipWaiting())
  )
})

// Activate - take control immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
  event.waitUntil(self.clients.claim())
})

// Fetch - network first for HTML, cache for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Never cache index.html - always fetch fresh
  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request)
      })
    )
    return
  }
  
  // Cache Cloudinary images (your images)
  if (url.hostname === 'res.cloudinary.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((fetchResponse) => {
            // Only cache successful responses
            if (fetchResponse.ok) {
              cache.put(event.request, fetchResponse.clone())
            }
            return fetchResponse
          })
        })
      })
    )
    return
  }
  
  // Cache assets (JS, CSS, images)
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((fetchResponse) => {
            cache.put(event.request, fetchResponse.clone())
            return fetchResponse
          })
        })
      })
    )
    return
  }
  
  // Everything else - network first
  event.respondWith(fetch(event.request))
})