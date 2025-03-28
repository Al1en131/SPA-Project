const CACHE_NAME = 'story-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/scripts/index.js',
    '/scripts/pages/story/storyPage.js',
    '/scripts/presenters/storyPresenter.js',
    '/scripts/utils/indexedDB.js',
    '/styles/main.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New Story Update!',
        icon: 'icon.png',
        badge: '/icon.png'
    };
    event.waitUntil(
        self.registration.showNotification('Story App Notification', options)
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'NEW_STORY') {
        self.registration.showNotification('Story App', {
            body: event.data.message,
            icon: '/icon.png',
            badge: '/icon.png'
        });
    }
});

