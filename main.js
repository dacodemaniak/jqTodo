if ('serviceWorker' in navigator) {
  console.log('Enable service worker');
    // Enregistre un Service Worker
    navigator.serviceWorker.register('/assets/javascript/service-worker.js');
  
  }