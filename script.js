// TODO:   Index
//         1. Random image of any dog (https://dog.ceo/api/breeds/image/random) (DONE)
//         2. Button to update image (updateImage) (DONE)
//         3. List with all breeds (https://dog.ceo/api/breeds/list/all) (DONE)
//         4. Event listener to each breed, that links to sub-page (#breed-...)
//         5. Header for text (DONE)

// TODO:   Breed
//         1. Random image of a given breed (https://dog.ceo/api/breed/ + hash + /images/random) (DONE)
//         2. Button to update image (updateImage) (DONE)
//         3. List all sub-breeds grom given breed, if any (https://dog.ceo/api/breed/ + hash + /list)
//         4. Event listener to each sub-breed, that links to sub-breed page (#breed-.../...)
//         5. Header for text with breed name
//         6. Render all breed images (getAllBreedImages, https://dog.ceo/api/breed/ + hash + /images)

// TODO:   Sub-breed
//         1. Random image of given sub-breed (https://dog.ceo/api/breed/ + hash + /images/random) (DONE)
//         2. Buton to update image (updateImage) (DONE)
//         3. Render all sub-breed images (getAllBreedImages, https://dog.ceo/api/breed/ + hash + /images)
//         4. Header for text whith breed and sub-breed name

let body = document.body;
let header = document.createElement("h1");
let randomImage = document.createElement("img");
let br = document.createElement("br");
let update = document.createElement("button");
let list = document.createElement("ul");

randomImage.style.height = "350px";
update.textContent = "Shuffle!"

request();

function request() {
  clearBody();
  updateImage();

  body.appendChild(header);
  body.appendChild(randomImage);
  body.appendChild(br);
  body.appendChild(update);
  body.appendChild(list);

  header.textContent = "List of all dogs breeds";
  update.addEventListener("click", updateImage);

  new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open("GET", "https://dog.ceo/api/breeds/list/all");

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
    for (let key in dogsList) {
      let li = document.createElement("li");
      let breed = document.createElement("span");

      breed.textContent = key;
      breed.style.textTransform = "capitalize"
      breed.addEventListener("click", function() {
        window.location.hash = "breed-" + key;
        request();
      });

      li.appendChild(breed);
      list.appendChild(li);

      if (dogsList[key].length > 0) {
        let ul = document.createElement("ul");
        for (let i of dogsList[key]) {
          let subLi = document.createElement("li");

          subLi.textContent = i;
          subLi.style.textTransform = "capitalize"
          subLi.addEventListener("click", function() {
            window.location.hash = "breed-" + key + "/" + i;
            request();
          });

          ul.appendChild(subLi);
        }

        li.appendChild(ul);
      }
    }
  }, function(err) {
    console.log(err);
  });
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

function clearBody() {
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
}