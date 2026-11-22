// Service worker : garde les fichiers de l'appli en cache.
// IMPORTANT : à chaque fois que tu modifies un fichier, change le numéro de version
// ci-dessous (v1 -> v2 -> v3…), sinon l'iPhone continuera d'afficher l'ancienne version.
const VERSION = "mon-appli";
const FICHIERS = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "manifest.webmanifest",
  "icon-180.png",
  "icon-512.png",
];

// Installation : on met les fichiers en cache
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)));
  self.skipWaiting();
});

// Activation : on supprime les anciens caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((noms) =>
      Promise.all(noms.filter((n) => n !== VERSION).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Requêtes : cache d'abord, réseau en secours
self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
