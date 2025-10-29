/**
 * Service Worker for Test Simulator PWA
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'test-simulator-v2';
const urlsToCache = [
  'index.html',
  'app.js',
  'style.css',
  'manifest.json',
  'icon-192.svg',
  'icon-512.svg'
];

/**
 * Install event - cache resources
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Cache new resources dynamically
            return caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache GET requests from same origin
                if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, fetchResponse.clone());
                }
                return fetchResponse;
              });
          });
      })
      .catch(() => {
        // Return offline page if available
        return caches.match('index.html');
      })
  );
});

/**
 * Message event - handle skip waiting request
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
