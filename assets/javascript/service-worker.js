/**
 * service-worker.js : Services PWA
 */

 /**
  * Définition des constantes de configuration
  */
const
version = '1.0.0',
CACHE = version + '::MyTodo',
offlineURL = '/offline/',
installFilesEssential = [
  '/',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/css/todo.css',
  '/node_modules/bootstrap/dist/css/bootstrap.min.css',
  '/main.js',
  '/assets/javascript/TodoList.js',
  '/assets/javascript/TodoClass.js',
  '/assets/javascript/todo.js',
  '/assets/javascript/offlinepage.js',
  '/images/todo_152.png'
].concat(offlineURL),
installFilesDesirable = [
  '/assets/images/todo_16.png'
];

/**
 * Installation des fichiers statiques
 */
function installStaticFiles() {

    return caches.open(CACHE)
      .then(cache => {
  
        // Mettre en cache les fichiers "souhaités"
        cache.addAll(installFilesDesirable);
  
        // Mettre en cache les fichiers "essentiels"
        return cache.addAll(installFilesEssential);
  
      });
  }

  /**
   * Installation de l'application
   */
  self.addEventListener('install', event => {

    console.log('service worker: installation');
  
    // cache core files
    event.waitUntil(
      installStaticFiles()
      .then(() => self.skipWaiting())
    );
  
  });

  /**
   * Effacement des caches anciens
   */
  function clearOldCaches() {

    return caches.keys()
      .then(keylist => {
  
        return Promise.all(
          keylist
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        );
  
      });
  
  }

  /**
   * Une fois que l'application est activée
   */
  self.addEventListener('activate', event => {

    console.log('service worker: application activée');
  
      // Supprime les anciens fichiers en cache
    event.waitUntil(
      clearOldCaches()
      .then(() => self.clients.claim())
      );
  
  });

  /**
   * Récupération des données à partir du réseau
   */
  self.addEventListener('fetch', event => {

    // abandon non-GET requests
    if (event.request.method !== 'GET') return;
  
    let url = event.request.url;
  
    event.respondWith(
  
      caches.open(CACHE)
        .then(cache => {
  
          return cache.match(event.request)
            .then(response => {
  
              if (response) {
                // Retourne le fichier en cache
                console.log('Récupération du cache: ' + url);
                return response;
              }
  
              // make network request
              return fetch(event.request)
                .then(newreq => {
  
                  console.log('Récupération à partir du réseau: ' + url);
                  if (newreq.ok) cache.put(event.request, newreq.clone());
                  return newreq;
  
                })
                // L'application est hors-ligne
                .catch(() => offlineAsset(url));
  
            });
  
        })
  
    );
});

// is image URL?
let iExt = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].map(f => '.' + f);
function isImage(url) {

  return iExt.reduce((ret, ext) => ret || url.endsWith(ext), false);

}


// Retourne les assets hors-ligne
function offlineAsset(url) {

  if (isImage(url)) {

    // Retourne une image
    return new Response(
      '<svg role="img" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title>offline</title><path d="M0 0h400v300H0z" fill="#eee" /><text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="50" fill="#ccc">offline</text></svg>',
      { headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store'
      }}
    );

  }
  else {

    // Retourne une page
    return caches.match(offlineURL);

  }

}