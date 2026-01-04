const CACHE_NAME = 'tetris-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './js/main.js',
    './js/game.js',
    './js/tetris.js',
    './js/renderer.js',
    './js/input.js'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});