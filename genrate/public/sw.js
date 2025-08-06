const CACHE_NAME = 'genrate-v1';
const STATIC_CACHE = 'genrate-static-v1';
const DYNAMIC_CACHE = 'genrate-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/books/class1_english[1]/aemr101.pdf',
  '/books/class1_english[1]/aemr102.pdf',
  '/books/class1_english[1]/aemr103.pdf',
  '/books/class1_english[1]/aemr104.pdf',
  '/books/class1_english[1]/aemr105.pdf',
  '/books/class1_english[1]/aemr106.pdf',
  '/books/class1_english[1]/aemr107.pdf',
  '/books/class1_english[1]/aemr108.pdf',
  '/books/class1_english[1]/aemr109.pdf',
  '/books/class1_hindi[1]/ahsr101.pdf',
  '/books/class1_hindi[1]/ahsr102.pdf',
  '/books/class1_hindi[1]/ahsr103.pdf',
  '/books/class1_hindi[1]/ahsr104.pdf',
  '/books/class1_hindi[1]/ahsr105.pdf',
  '/books/class1_hindi[1]/ahsr106.pdf',
  '/books/class1_hindi[1]/ahsr107.pdf',
  '/books/class1_hindi[1]/ahsr108.pdf',
  '/books/class1_hindi[1]/ahsr109.pdf',
  '/books/class1_hindi[1]/ahsr110.pdf',
  '/books/class1_hindi[1]/ahsr111.pdf',
  '/books/class1_hindi[1]/ahsr112.pdf',
  '/books/class1_hindi[1]/ahsr113.pdf',
  '/books/class1_hindi[1]/ahsr114.pdf',
  '/books/class1_hindi[1]/ahsr115.pdf',
  '/books/class1_hindi[1]/ahsr116.pdf',
  '/books/class1_hindi[1]/ahsr117.pdf',
  '/books/class1_hindi[1]/ahsr118.pdf',
  '/books/class1_hindi[1]/ahsr119.pdf',
  '/books/class1_hindi[1]/ahsr1ps.pdf',
  '/books/class1_math[1]/aejm101.pdf',
  '/books/class1_math[1]/aejm102.pdf',
  '/books/class1_math[1]/aejm103.pdf',
  '/books/class1_math[1]/aejm104.pdf',
  '/books/class1_math[1]/aejm105.pdf',
  '/books/class1_math[1]/aejm106.pdf',
  '/books/class1_math[1]/aejm107.pdf',
  '/books/class1_math[1]/aejm108.pdf',
  '/books/class1_math[1]/aejm109.pdf',
  '/books/class1_math[1]/aejm110.pdf',
  '/books/class1_math[1]/aejm111.pdf',
  '/books/class1_math[1]/aejm112.pdf',
  '/books/class1_math[1]/aejm113.pdf',
  '/books/class1_math[1]/aejm1ps.pdf'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.log('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle PDF files with cache-first strategy
  if (request.url.includes('.pdf')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            console.log('Serving PDF from cache:', request.url);
            return response;
          }
          return fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return fetchResponse;
            });
        })
        .catch(() => {
          // Return a fallback response for PDFs
          return new Response('PDF not available offline', {
            status: 404,
            statusText: 'Not Found'
          });
        })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return new Response('API not available offline', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return fetchResponse;
            });
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.destination === 'document') {
            return caches.match('/');
          }
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Handle any pending offline actions
    console.log('Processing background sync...');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Genrate App', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 