//clean up 
//whenever content is changed, change the cache name variables below
var CACHE_STATIC_NAME = 'vrentals-static-v1'
var CACHE_DYNAMIC_NAME = 'vrentals-dynamic-v1'

self.addEventListener('install', function(event) 
{
    console.log('[SW]: Service worker installing...', event);
    //new:
    event.waitUntil( //wont finish unitl caching is complete
        caches.open(CACHE_STATIC_NAME)
            .then(function(cache) 
            {
                console.log('[SW]: Precaching app shell...', event);
                cache.addAll([
                    "/",
                    "manifest.json",
                    "./index.html",
                    "./imprint.html",
                    "./service-worker.js",
                    "./js/app.js",
                    "./js/car-details.js",
                    "./js/car-list.js",
                    "./js/helper.js",
                    "./js/login-manager.js",
                    "./js/logoff-manager.js",
                    "./js/profile-manager.js",
                    "./js/signup-manager.js",
                    "service-Worker.js",
                    // 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
                    // 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'
                ]);
            })
    )
});

self.addEventListener('activate', function(event) 
{
    console.log('[SW]: Service worker activating...', event);
    event.waitUntil(
        caches.keys()
            .then(function(keyList) 
            {
                return Promise.all(keyList.map(function(key) 
                {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) 
                    {
                        console.log('[SW]: Removing old cache.', key);
                        return caches.delete(key);
                    }
                })); //takes array of promises and waits until finished
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) 
{
    // console.log('[SW]: Service worker fetching...', event);
    // new:
    // event.respondWith((async ()=> 
    // {
    //     const cachedResponse = await caches.match(event.request);
    //     if(cachedResponse)
    //     {
    //         return cachedResponse; //response comes from the cache
    //     }
    //     else
    //     {
    //         return fetch(event.request) //not cached, get from internet...
    //         .then(function(dynamicResponse) 
    //         { //and place it into dynamic cache
    //             caches.open(CACHE_DYNAMIC_NAME)
    //             .then(function(cache) 
    //             {
    //                 cache.put(event.request.url, dynamicResponse.clone()) 
    //                 does not send request, uses response (can be done only once), and is therefore cloned
    //                 to respond back to the browser (clone is stored in cache, rest is shown)
    //                 return dynamicResponse;
    //             })
    //         })
    //         .catch(function(error) 
    //         {
    //             do not throw exception when fetching fails
    //         });
    //     }
    // }));
});