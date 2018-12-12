let body = document.body;
let header = document.createElement("h1");
let randomImage = document.createElement("img");
let br = document.createElement("br");
let update = document.createElement("button");

let currentBreed = "";

randomImage.style.height = "350px";
update.textContent = "Shuffle!"

request();

function request() {
  let hash = window.location.hash.slice(1);
  clearBody();
  renderSPA();
  updateImage();

  if (hash.includes("/")) {
    getAllBreedImages();
  } else {
    new Promise(function(resolve, reject) {

      let req = new XMLHttpRequest();

      if (hash && !hash.includes("/")) {
        req.open("GET", "https://dog.ceo/api/breed/" + hash.split("-")[1] + "/list");
      } else {
        req.open("GET", "https://dog.ceo/api/breeds/list/all");
      }

      req.onload = function() {
        if (req.status === 200) {
          resolve(req.response);
        } else {
          reject(Error("An error occured while loading list. error code: " + req.statusText));
        }
      }

      req.send();
    }).then(function(result) {
        let dogsList = JSON.parse(result).message;
        if (Array.isArray(dogsList)) {
          body.appendChild(setList(dogsList, ("breed-" + currentBreed)));
        } else {
          body.appendChild(setList(dogsList, "breed-"));
        }

        if (hash) {
          getAllBreedImages();
        }
      },
      function(err) {
        console.log(err);
      });
  }
}

function renderSPA() {
  body.appendChild(header);
  body.appendChild(randomImage);
  body.appendChild(br);
  body.appendChild(update);

  update.addEventListener("click", updateImage);

  let hash = window.location.hash.slice(1);

  if (hash) {
    header.textContent = hash.split("-")[1];
    header.style.textTransform = "capitalize";
  } else {
    header.textContent = "List of all dogs breeds";
  }


}

function updateImage() {
  new Promise(function(resolve, reject) {
    let hash = window.location.hash.slice(1)
    let req = new XMLHttpRequest();
    if (hash) {
      req.open("GET", "https://dog.ceo/api/breed/" + hash.split("-")[1] + "/images/random");
    } else {
      req.open("GET", "https://dog.ceo/api/breeds/image/random");
    }

    req.onload = function() {
      if (req.status === 200) {
        resolve(req.response);
      } else {
        reject(Error('An error occurred while loading image. error code: ' + req.statusText));
      }
    }

    req.send();
  }).then(function(result) {
    let url = JSON.parse(result).message;
    randomImage.setAttribute("src", url);
  }, function(err) {
    console.log(err);
  });
}

function setList(list, hash) {
  let ul = document.createElement("ul");

  if (Array.isArray(list)) {
    for (let i of list) {
      let li = document.createElement("li");
      let span = document.createElement("span");

      span.addEventListener("click", function() {
        window.location.hash = hash + "/" + i;
        request();
      });
      span.textContent = i;

      li.appendChild(span);
      ul.appendChild(li);
    }
  } else {
    for (let key in list) {
      let li = document.createElement("li");
      let span = document.createElement("span");
      span.addEventListener("click", function() {
        window.location.hash = hash + key;
        currentBreed = key;
        request();
      });
      span.textContent = key;
      li.appendChild(span);
      if (list[key].length > 0) {
        li.appendChild(setList(list[key], hash + key));
      }

      ul.appendChild(li)
    }
  }

  return ul;
}

function getAllBreedImages() {
  new Promise(function(resolve, reject) {
    let hash = window.location.hash.slice(1);
    let req = new XMLHttpRequest();
    req.open("GET", "https://dog.ceo/api/breed/" + hash.split("-")[1] + "/images");
    req.onload = function() {
      if (req.status === 200) {
        resolve(req.response);
      } else {
        reject(Error("An error occured while loading images. error code: " + req.statusText));
      }
    }

    req.send();
  }).then(function(result) {
      let images = JSON.parse(result).message;
      body.appendChild(setImages(images));
    },
    function(err) {
      console.log(err);
    });;
}

function setImages(list) {
  let div = document.createElement("div");
  for (let i of list) {
    let img = document.createElement("img");
    img.setAttribute("src", i);

    div.appendChild(img);
  }
  return div;
}

function clearBody() {
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
}