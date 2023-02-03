import CACHE from "./cache.js";

//All the DOM functionality and control of the application happens in this file
//All the code dealing with the Cache is in the cache.js file.
const APP = {
  itemList: [],
  fileList: [],
  init() {
    //page loaded
    // CACHE.init().then(APP.getFiles);

    const initPromise = CACHE.init();

    document.getElementById("itemForm").addEventListener("submit", APP.addItem);
    document.getElementById("btnItem").addEventListener("click", APP.addItem);
    document
      .getElementById("btnList")
      .addEventListener("click", APP.saveListAsFile);

    document.getElementById("file_list").addEventListener("click", (ev) => {
      if (ev.target.dataset.action) {
        switch (ev.target.dataset.action.toLowerCase()) {
          case "display":
            APP.displayFileContents(ev);
            break;
          case "delete":
            APP.deleteFile(ev);
            break;

          default:
            break;
        }
      }
    });

    //add dummy values for quick testing
    // APP.itemList.push(`Random number - ${Math.random()}`);
    // APP.itemList.push(`Random number - ${Math.random()}`);
    // APP.itemList.push(`Random number - ${Math.random()}`);
    // APP.displayList();
    //End of test code

    initPromise.then(APP.getFiles);
  },
  addItem(ev) {
    //add an item to the list
    ev.preventDefault();
    let item = document.getElementById("gItem").value;
    item = item.trim();
    if (!item) return;
    APP.itemList.push(item);
    APP.displayList();
  },

  saveListAsFile(ev) {
    ev.preventDefault();

    if (!APP.itemList || APP.itemList.length === 0) {
      return;
    }

    const data = JSON.stringify(APP.itemList);
    const timestamp = Date.now();
    const filename = `items_${timestamp}.json`;

    const file = new File([data], filename, {
      type: "application/json",
    });

    const response = new Response(file, {
      status: 200,
      statusText: "Ok",
      headers: {
        "content-type": file.type,
        "content-length": file.length,
        "X-file": file.name,
        "X-length": APP.itemList.length,
      },
    });

    APP.saveFile(file, response)
      .then(() => {
        APP.itemList = [];
        APP.displayList();
        APP.getFiles();
      })
      .catch((err) => {
        console.warn(err);
      });
  },

  saveFile(file, response) {
    const url = new URL(`${file.name}`, location.origin);
    return CACHE.put(url, response);
  },

  getFiles() {
    CACHE.keys()
      .then((keys) => {
        let promiseArray = keys.map((key) => CACHE.match(key.url));
        return Promise.all(promiseArray);
      })
      .then((files) => {
        APP.fileList = [];
        files.forEach((file) => APP.fileList.push(file.headers.get("X-file")));
      })
      .catch((err) => {
        console.warn(err);
      })
      .finally(() => {
        APP.displayFiles(APP.fileList);
      });
  },

  displayList() {
    let list = document.getElementById("item_list");
    if (APP.itemList.length === 0) {
      list.innerHTML = "No Items currently.";
    } else {
      list.innerHTML = APP.itemList
        .map((txt) => {
          return `<li>${txt}</li>`;
        })
        .join("");
    }
    document.getElementById("gItem").value = "";
  },

  displayFiles(matches) {
    let list = document.getElementById("file_list");
    if (matches.length === 0) {
      list.innerHTML = "No Files currently.";
    } else {
      list.innerHTML = matches
        .map((txt) => {
          return `<li data-ref="${txt}">
                    <span data-action="display" class="filename">${txt}</span> 
                    <button data-action="delete" class="delete">Delete</button>
                  </li>`;
        })
        .join("");
    }
  },

  displayFileContents(ev) {
    let contentText = "";

    const paragraphEl = document.querySelector(".data_display > pre > code");
    paragraphEl.innerHTML = contentText;

    //function can be called with null parameter to clean the list
    if (ev) {
      const el = ev.target.closest("li[data-ref]");
      if (el && el.dataset.ref) {
        const url = new URL(el.dataset.ref, location.origin);
        CACHE.match(url)
          .then((element) => {
            return element.json();
          })
          .then((content) => {
            if (Array.isArray(content)) {
              contentText = content
                .map((item) => {
                  return `<li>${item}</li>`;
                })
                .join("");
            } else {
              contentText = content;
            }
            if (!contentText) contentText = "File is empty";
            paragraphEl.innerHTML = contentText;
          });
      }
    }
  },
  deleteFile(ev) {
    ev.preventDefault();

    const el = ev.target.closest("li[data-ref]");
    if (el && el.dataset.ref) {
      CACHE.delete(el.dataset.ref).then(() => {
        APP.getFiles();
        APP.displayFileContents(null);
      });
    }
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
