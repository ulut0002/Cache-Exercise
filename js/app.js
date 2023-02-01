import CACHE from "./cache.js";

CACHE.open();
CACHE.put();
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

    //access the cache
    //then display files
    //and then show all the current files

    //add dummy values
    APP.itemList.push(`Random number - ${Math.random()}`);
    APP.itemList.push(`Random number - ${Math.random()}`);
    APP.itemList.push(`Random number - ${Math.random()}`);
    APP.displayList();

    // APP.displayFiles();
    // APP.getFiles();
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

    //turn the data from the list into the contents for a json file
    const itemsObj = JSON.stringify(APP.itemList);

    //and then create a file with the json
    const nowValue = Date.now();
    let data = itemsObj;

    let filename = `items_${nowValue}.json`;
    let file = new File([data], filename, {
      type: "text/plain",
      lastModified: nowValue,
    });

    //create a url or request object
    let response = new Response(file, {
      status: 200,
      statusText: "OK",
      header: {
        "content-type": file.type,
        "content-length": file.length,
        "X-file": file.name,
      },
    });

    APP.saveFile(file, response)
      .then(() => {
        //file is saved..
        APP.itemList = [];
        return APP.getFiles();
      })
      .then((filesArr) => {
        console.log("Files array ", filesArr);
        APP.displayFiles();
      });
  },

  //TODO:

  saveFile(file, response) {
    //save the file in the Cache
    //when file has been saved,
    //clear the displayed list
    //and then update the list of files
    const promise = new Promise(function (resolve, reject) {
      let request = new Request(new URL(`${file.name}`, location.origin));
      CACHE.put(request, response)
        .then(() => {
          resolve();
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
    APP.fileList = [];
    CACHE.keys()
      .then((keys) => {
        let promiseArray = keys.map((key) => CACHE.match(key.url));
        return Promise.all(promiseArray);
      })
      .catch((err) => {
        console.error(err);
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

    // console.log("here");
    let list = document.getElementById("file_list");
    if (matches.length === 0) {
      list.innerHTML = "No Files currently.";
    } else {
      list.innerHTML = matches
        .map((txt) => {
          return `<li>${txt} <span id="delete">Delete</span></li>`;
        })
        .join("");
    }
    // document.getElementById("gItem").value = "";
  },

  displayFileContents(ev) {
    //get the list item from the file
    //and show its contents in the <pre><code> area
  },
  deleteFile(ev) {
    ev.preventDefault();
    //user has clicked on a button in the file list
    //delete the file from the cache using the file name
    //remove the list item from the list if successful
    //clear the code contents
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
