import CACHE from "./cache.js";

//All the DOM functionality and control of the application happens in this file
//All the code dealing with the Cache is in the cache.js file.
const APP = {
  itemList: [],
  fileList: [],
  activeLI: "",
  init() {
    //page loaded
    CACHE.init();
    document.getElementById("itemForm").addEventListener("submit", APP.addItem);
    document.getElementById("btnItem").addEventListener("click", APP.addItem);
    document
      .getElementById("btnList")
      .addEventListener("click", APP.saveListAsFile);

    document.getElementById("file_list").addEventListener("click", (ev) => {
      if (ev.target.dataset.action) {
        if (ev.target.dataset.action.toLowerCase() === "display") {
          APP.displayFileContents(ev);
        } else if (ev.target.dataset.action.toLowerCase() === "delete") {
          APP.deleteFile(ev);
        }
      }
    });

    //add dummy values for quick testing
    APP.itemList.push(`Random number - ${Math.random()}`);
    APP.itemList.push(`Random number - ${Math.random()}`);
    APP.itemList.push(`Random number - ${Math.random()}`);
    APP.displayList();
    //End of test code

    // Get current files, and display them as a list with a  Delete button
    APP.getFiles().then((fileArr) => {
      APP.fileList = [];
      fileArr.forEach((file) => {
        APP.fileList.push(file.headers.get("X-file"));
      });
      APP.displayFiles(APP.fileList);
    });
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
    //turn the data from the list into the contents for a json file
    //and then create a file with the json
    //and then create a response object to hold the file
    //and then save the response in the cache
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

    let clone = response.clone();

    APP.saveFile(file, response)
      .then(() => {
        //file is saved.. Clear the list and return list of current files
        APP.itemList = [];
        return APP.getFiles();
      })
      .then((filesArr) => {
        APP.getFiles().then((fileArr) => {
          APP.fileList = [];
          fileArr.forEach((file) => {
            APP.fileList.push(file.headers.get("X-file"));
            APP.displayFiles(APP.fileList);

            APP.itemList = [];
            APP.displayList();
          });
        });
      });
  },

  saveFile(file, response) {
    //save the file in the Cache
    //when file has been saved,
    //clear the displayed list
    //and then update the list of files

    const url = new URL(`${file.name}`, location.origin);

    const promise = new Promise(function (resolve, reject) {
      CACHE.put(url, response)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  },

  getFiles() {
    //display all the files in the cache
    //loop through response matches and display the file names
    return CACHE.keys()
      .then((keys) => {
        let promiseArray = keys.map((key) => CACHE.match(key.url));
        // console.log("promise array ", promiseArray);
        return Promise.all(promiseArray);
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  },

  displayList() {
    //populate the list of items
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
    //show the file names from the cache as a list.
    //each list item contains a span for the file name plus a button for deleting the file from the cache

    let list = document.getElementById("file_list");
    if (matches.length === 0) {
      list.innerHTML = "No Files currently.";
    } else {
      list.innerHTML = matches
        .map((txt) => {
          return `<li data-ref="${txt}"><span data-action="display">${txt}</span> 
                  <button data-action="delete" class="delete">Delete</button></li>`;
        })
        .join("");
    }
    // document.getElementById("gItem").value = "";
  },

  displayFileContents(ev) {
    //get the list item from the file
    //and show its contents in the <pre><code> area
    let contentText = "";
    const paragraphEl = document.querySelector(".data_display > pre > code");

    const el = ev.target.closest("li[data-ref]");
    if (el && el.dataset.ref) {
      // console.log(el.dataset.ref);
      const url = new URL(el.dataset.ref, location.origin);
      CACHE.match(url)
        .then((element) => {
          return element.json();
        })
        .then((content) => {
          // console.log(content);
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
  },
  deleteFile(ev) {
    ev.preventDefault();

    const el = ev.target.closest("li[data-ref]");
    if (el && el.dataset.ref) {
      CACHE.delete(el.dataset.ref)
        .then(() => {
          // console.log("deleted");
          return APP.getFiles();
        })
        .then((fileArr) => {
          APP.fileList = [];
          fileArr.forEach((file) => {
            APP.fileList.push(file.headers.get("X-file"));
          });
          APP.displayFiles(APP.fileList);
        });
    }

    //user has clicked on a button in the file list
    //delete the file from the cache using the file name
    //remove the list item from the list if successful
    //clear the code contents
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
