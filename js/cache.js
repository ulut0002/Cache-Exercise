//file for all the cache functionality
// caches.open()
// caches.keys()
// caches.delete()
// caches.matchAll()

// cache.put()
// cache.match()
const log = console.log;

const CACHE = {
  cacheVersion: 1,
  cacheName: null, //this gets set in the init() method
  userName: "ulut0002", //replace this with your own username
  cacheObj: null,
  initiated: false,
  init() {
    CACHE.cacheName = `filecache-${CACHE.userName}-${CACHE.cacheVersion}`;
    // console.log)CACHE.open(CACHE.cacheName);
  },
  open(cacheName) {
    return new Promise(function (resolve, reject) {
      if (!cacheName) {
        reject(new Error("Cache name is missing"));
      }

      if (CACHE.cacheObj) {
        resolve(CACHE.cacheObj);
      } else {
        caches
          .open(cacheName)
          .then((result) => {
            CACHE.cacheObj = result;
            resolve(result);
          })
          .catch((error) => reject(error));
      }
    });
  },
  put(request, response) {
    return CACHE.open(CACHE.cacheName)
      .then((cache) => {
        return cache.put(request, response);
      })
      .catch((err) => {});
  },
  keys() {
    return CACHE.open(CACHE.cacheName).then().keys();
  },
};

export default CACHE;
