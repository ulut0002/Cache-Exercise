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
    const promise = new Promise(function (resolve, reject) {
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
    return promise;
  },
  put(request, response) {
    const promise = new Promise(function (resolve, reject) {
      CACHE.open(CACHE.cacheName)
        .then((cache) => {
          resolve(cache.put(request, response));
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  },
  keys() {
    const promise = new Promise(function (resolve, reject) {
      CACHE.open(CACHE.cacheName)
        .then((cache) => {
          resolve(cache.keys());
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  },
  delete(name) {
    const promise = new Promise(function (resolve, reject) {
      caches
        .open(CACHE.cacheName)
        .then((cache) => {
          resolve(cache.delete(name));
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  },

  matchAll(requestArr) {
    const promise = new Promise(function (resolve, reject) {
      CACHE.open(CACHE.cacheName)
        .then((cache) => {
          resolve(cache.matchAll(requestArr));
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  },

  match(request) {
    const promise = new Promise(function (resolve, reject) {
      CACHE.open(CACHE.cacheName)
        .then((cache) => {
          resolve(cache.match(request));
        })
        .catch((err) => reject(err));
    });
    return promise;
  },
};

export default CACHE;
