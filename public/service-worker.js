// Service Worker for Coach Reva PWA
const CACHE_NAME = 'coach-reva-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/config.js',
  '/js/auth.js',
  '/js/api.js',
  '/js/notifications.js',
  '/js/app.js',
  '/images/logo.svg',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/images/google-icon.svg',
  '/images/check-in-icon.svg',
  '/images/history-icon.svg',
  '/images/settings-icon.svg',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests and API calls
  if (
    !event.request.url.startsWith(self.location.origin) || 
    event.request.url.includes('/api/')
  ) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.notification.body,
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-96x96.png',
    data: data.data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.notification.title, options)
  );
});

// Notification click event - open app and focus
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If a window client is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
