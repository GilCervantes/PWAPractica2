const CACHE_NAME = 'v1_cache_GCHPWA';

var urlsToCache = [
    './',
    './android/android-laucher-launcherico-48-48.png',
    './android/android-laucher-launcherico-72-72.png',
    './android/android-laucher-launcherico-96-96.png',
    './ios/16.png',
    './ios/20.png',
    './ios/29.png',
    './windows11/LargeTile.scale-100.png',
    './windows11/LargeTile.scale-125.png',
    './windows11/LargeTile.scale-150.png'
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(Cache => {
            return Cache.addAll(urlsToCache)
                .then(() => {
                    self.skipWaiting();
                })
        })
        .catch(err => console.log("No se ha registrado el cache", err))
    );
});

self.addEventListener('activate', e => {
    const cacheWhiteList = [CACHE_NAME];

    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhiteList.indexOf(cacheName) == -1) {
                        //borrar elementos que no se necesitan
                        return cacheName.delete(cacheName);
                    }
                })

            );
        })
        .then(() => {
            self.clients.claim(); //activa la cache en el dispositivo.
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
        .then(res => {
            if (res) {
                //devuelvo datos desde cache
                return res;
            }
            return fetch(e.request); //hago peticion al servidor en 
            //caso de que no este en cache
        })
    )
})