export function displayFavouriteList() {
  const favouritesList = document.querySelector(".favourites");
  var myLocalStorage = window.localStorage;

  // parse favourites array from local storage
  var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));

  // if favourites has no movies, display below message
  if (!favouritesArray || favouritesArray.length == 0) {
    favouritesList.innerHTML =
      "<div style='color:white ; font-size: 2rem'>No Favourites Selected. Go to Home!!!</div>";
  }

  // iterate over favourites array and display each favourites movie
  for (let i = 0; i < favouritesArray.length; i++) {
    displayFavourite(favouritesArray[i]);
  }

  function displayFavourite(id) {
    var searchResult = {};
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=604122d2`)
      .then((response) => response.json())
      .then((data) => {
        searchResult = data;

        var movieComponent = document.createElement("div");
        movieComponent.className = "card search-result";

        movieComponent.innerHTML = `<div class='movie-card favourites-card'>
          <img src='${searchResult.Poster}' class='movie-pic'></img>
          <div class='title'>
            <h4>${searchResult.Title}</h4>
            </div>
            <div class='button-column'>
              <button class='fav-btn${searchResult.imdbID} fav-btn'>Remove From Favourite</button>  
                <button class='more-info${searchResult.imdbID} more-info'>More Info</button> 
            </div>
        </div>`;

        favouritesList.appendChild(movieComponent);

        // more info button
        var infoBtn = document.querySelector(
          `.more-info${searchResult.imdbID}`
        );
        infoBtn.addEventListener("click", () => {
          addIdToStorage(searchResult.imdbID);
        });

        var favBtn = document.querySelector(`.fav-btn${searchResult.imdbID}`);
        favBtn.addEventListener("click", () =>
          // remove from favourite
          removeFromFavourite(favBtn, searchResult.imdbID)
        );
      });
  }

  function removeFromFavourite(favBtn, id) {
    var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));
    var favBtn = document.querySelector(`.fav-btn${id}`);
    favouritesArray.splice(favouritesArray.indexOf(id), 1);

    // remove the component from list
    favBtn.parentElement.parentElement.parentElement.remove();

    // update the local storage
    myLocalStorage.setItem("favourites", JSON.stringify(favouritesArray));
  }

  function addIdToStorage(id) {
    myLocalStorage.setItem("movieId", id);
    window.location.assign("movieInfo.html");
  }
}
