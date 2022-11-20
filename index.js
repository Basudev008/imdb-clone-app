import * as favourite from "./favourites.js";
import * as Info from "./movieInfo.js";

const searchBox = document.querySelector(".search-box");
const searchIcon = document.querySelector(".search-icon");
const searchList = document.querySelector(".search-list");
const movieInfo = document.querySelector(".movie");
const favouritesList = document.querySelector(".favourites");
const notification = document.querySelector(".notification");

var myLocalStorage = window.localStorage;

// conditional rendering for pages
if (movieInfo) {
  Info.movieInfo();
} else if (favouritesList) {
  favourite.displayFavouriteList();
} else {
  // search array to store results for the search box with limit = 5
  var searchResult = [];

  searchBox.addEventListener("keyup", () => searchMovies());
  searchIcon.addEventListener("click", () => searchMovies());

  function searchMovies() {
    var searchKey = searchBox.value;
    console.log(searchKey.length);
    if (searchKey) {
      // if length of searchKey >= 3, use search parameter,
      // else use title parameter
      if (searchKey.length >= 3) {
        fetch(
          `https://www.omdbapi.com/?apikey=604122d2&s=${searchKey}&type=movie`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.Response == "True") {
              searchResult = data.Search;
              displaySearchResult();
            } else {
              searchList.innerHTML = `<h4>${data.Error}</h4>`;
            }
          });
      } else {
        fetch(`https://www.omdbapi.com/?apikey=604122d2&t=${searchKey}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.Response == "True") {
              searchResult[0] = data;
              displaySearchResult();
            } else {
              searchList.innerHTML = `<h4>${data.Error}</h4>`;
            }
          });
      }
    } else {
      searchList.innerHTML = "";
    }
  }

  // displaying the search result
  function displaySearchResult() {
    searchList.innerHTML = "";

    for (let i = 0; i < searchResult.length; i++) {
      var movieComponent = document.createElement("div");
      movieComponent.className = "card search-result";

      movieComponent.innerHTML = `<div class='movie-card'>
          <img src='${searchResult[i].Poster}' class='movie-pic'></img>
          <div class='title'>
            <h4>${searchResult[i].Title}</h4>
            </div>
            <div class='button-column'>
              <button class='fav-btn${searchResult[i].imdbID} fav-btn'>Add to Favourite</button>  
                <button class='more-info${searchResult[i].imdbID} more-info'>More Info</button> 
            </div>
        </div>`;

      searchList.appendChild(movieComponent);
      console.log(searchList);

      var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));

      var favBtn = document.querySelector(`.fav-btn${searchResult[i].imdbID}`);

      // if movie is in favourite array, show Add to favourite, else Favourite
      if (favouritesArray) {
        if (!favouritesArray.includes(searchResult[i].imdbID)) {
          favBtn.innerHTML = "<span>Add to favourite</span>";
        } else {
          favBtn.innerHTML = "<span>Favourite</span>";
        }
      }

      var infoBtn = document.querySelector(
        `.more-info${searchResult[i].imdbID}`
      );
      infoBtn.addEventListener("click", () => {
        addIdToStorage(searchResult[i].imdbID);
      });

      favBtn.addEventListener("click", () => {
        addToFavourite(favBtn, searchResult[i].imdbID);
        // After adding to favourite, empty the search box
        searchList.innerHTML = "";
      });
    }
  }

  function addToFavourite(favBtn, id) {
    var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));
    var favBtn = document.querySelector(`.fav-btn${id}`);

    // if the movie is already present, remove it
    // else push in the favourites array
    if (favouritesArray) {
      if (favouritesArray.includes(id)) {
        favBtn.innerText = "Add to favourite";
        favouritesArray.splice(favouritesArray.indexOf(id), 1);
        notification.innerHTML = "Removed from Favourite";
      } else {
        favBtn.innerText = "Favourite";
        favouritesArray.push(id);
        notification.innerHTML = "Added to Favourite";
      }
    } else {
      var array = [];
      array.push(id);
      favouritesArray = array;
      notification.innerHTML = "Added to Favourite";
    }

    setTimeout(() => {
      notification.innerHTML = "";
    }, 2000);
    myLocalStorage.setItem("favourites", JSON.stringify(favouritesArray));
    searchBox.value = "";
  }

  // function to add id of movie clicked for more info
  function addIdToStorage(id) {
    console.log("added");
    myLocalStorage.setItem("movieId", `${id}`);
    console.log(myLocalStorage);
    window.location.assign("movieInfo.html");
    searchBox.value = "";
  }

  // on clicking outside of search list, list disappears
  document.addEventListener("click", (e) => {
    if (!searchList.contains(e.target)) {
      searchList.innerHTML = "";
      searchBox.value = "";
    }
  });
}
