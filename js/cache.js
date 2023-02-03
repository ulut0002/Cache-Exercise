const CACHE = {
  cacheVersion: 1,
  cacheName: null, //this gets set in the init() method
  userName: "ulut0002", //replace this with your own username
  cacheObj: null,
  init(name) {
    CACHE.cacheName = `filecache-${CACHE.userName}-${CACHE.cacheVersion}`;
    if (name) CACHE.cacheName = name;

    const promise = new Promise(function (resolve, reject) {
      CACHE.open()
        .then((cache) => {
          CACHE.cacheObj = cache;
          resolve(cache);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  },

  open() {
    return caches.open(CACHE.cacheName);
  },
  put(request, response) {
    return CACHE.cacheObj.put(request, response);
  },
  keys() {
    return CACHE.cacheObj.keys();
  },
  delete(name) {
    return CACHE.cacheObj.delete(name);
  },

  matchAll(requestArr) {
    return CACHE.cacheObj.matchAll(requestArr);
  },

  match(request) {
    return CACHE.cacheObj.match(request);
  },
};

export default CACHE;
