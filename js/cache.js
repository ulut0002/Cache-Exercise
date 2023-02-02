const CACHE = {
  cacheVersion: 1,
  cacheName: null, //this gets set in the init() method
  userName: "ulut0002", //replace this with your own username
  cacheObj: null,
  init(name) {
    CACHE.cacheName = `filecache-${CACHE.userName}-${CACHE.cacheVersion}`;
    if (name) {
      CACHE.cacheName = name;
    }
  },

  open() {
    return new Promise(function (resolve, reject) {
      if (CACHE.cacheObj) {
        resolve(CACHE.cacheObj);
      } else {
        caches
          .open(CACHE.cacheName)
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
      .catch((err) => {
        throw err;
      });
  },
  keys() {
    return CACHE.open(CACHE.cacheName).then((cache) => {
      return cache.keys();
    });
  },
  delete(name) {
    return caches.open(CACHE.cacheName).then((cache) => {
      return cache.delete(name);
    });
  },
  matchAll(requestArr) {
    return CACHE.open(CACHE.cacheName).then((cache) => {
      return cache.matchAll(requestArr);
    });
  },

  match(request) {
    return CACHE.open(CACHE.cacheName).then((cache) => {
      return cache.match(request);
    });
  },
};

export default CACHE;
