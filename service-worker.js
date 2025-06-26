self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('society-pay-cache-v1').then(function(cache) {
      return cache.addAll([
        './',
        'index.html',
        'style.css',
        'script.js',
        'WhatsApp Image 2025-06-24 at 09.20.36_40235af2.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
