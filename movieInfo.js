export function movieInfo() {
  const myLocalStorage = window.localStorage;
  const movieInfo = document.querySelector(".movie");

  var id = myLocalStorage.getItem("movieId");
  var movieDetails = {};

  // fetch details based on movie imdbID stored in the local storage
  fetch(`https://www.omdbapi.com/?i=${id}&apikey=604122d2`)
    .then((response) => response.json())
    .then((data) => {
      movieDetails = data;
      displayMovieDetails();
    });

  // function to display movie details
  function displayMovieDetails() {
    movieInfo.innerHTML = `<div class='movie-card'>
        <img src='${movieDetails.Poster}' class='movie-pic'></img>
        <div>
          <h4>${movieDetails.Title}</h4>
          <h5>Genre: <span>${movieDetails.Genre}</span></h5>
          <h5>Plot: <span>${
            movieDetails.Plot == undefined ? "Not available" : movieDetails.Plot
          }</span></h5>
          </div>
          <div class='button-column'>
            <button class='fav-btn${
              movieDetails.imdbID
            } fav-btn'>Add to Favourite</button>  
          </div>
      </div>
      <div class='second-row'>
        <div>
          <ul>
            <li>Actors: ${
              movieDetails.Actors == undefined
                ? "Not available"
                : movieDetails.Actors
            }</li>
            <li>BoxOffice: ${
              movieDetails.BoxOffice == undefined
                ? "Not available"
                : movieDetails.BoxOffice
            }</li>
            <li>Country: ${
              movieDetails.Country == undefined
                ? "Not available"
                : movieDetails.Country
            }</li>
            <li>DVD: ${
              movieDetails.DVD == undefined ? "Not available" : movieDetails.DVD
            }</li>
            <li>Director: ${
              movieDetails.Director == undefined
                ? "Not available"
                : movieDetails.Director
            }</li>
            <li>Language: ${
              movieDetails.Language == undefined
                ? "Not available"
                : movieDetails.Language
            }</li>
            <li>Metascore: ${
              movieDetails.Metascore == undefined
                ? "Not available"
                : movieDetails.Metascore
            }</li>
          </ul>
        </div>
        <div>
          <ul>
            <li>Production: ${
              movieDetails.Production == undefined
                ? "Not available"
                : movieDetails.Production
            }</li>
            <li>Rated: ${
              movieDetails.Rated == undefined
                ? "Not available"
                : movieDetails.Rated
            }</li>
            <li>Release: ${
              movieDetails.Release == undefined
                ? "Not available"
                : movieDetails.Release
            }</li>
            <li>Runtime: ${
              movieDetails.Runtime == undefined
                ? "Not available"
                : movieDetails.Runtime
            }</li>
            <li>Type: ${
              movieDetails.Type == undefined
                ? "Not available"
                : movieDetails.Type
            }</li>            
            <li class='ratings'>Ratings: </li>
          </ul>
        </div>
        <div>
          <ul>
            <li>Writer: ${
              movieDetails.Writer == undefined
                ? "Not available"
                : movieDetails.Writer
            }</li>
            <li>Year: ${
              movieDetails.Year == undefined
                ? "Not available"
                : movieDetails.Year
            }</li>
            <li>imdbId: ${
              movieDetails.imdbId == undefined
                ? "Not available"
                : movieDetails.imdbId
            }</li>
            <li>imdbRating: ${
              movieDetails.imdbRating == undefined
                ? "Not available"
                : movieDetails.imdbRating
            }</li>
            <li>imdbVotes: ${
              movieDetails.imdbVotes == undefined
                ? "Not available"
                : movieDetails.imdbVotes
            }</li>
            <li>Website: ${
              movieDetails.Website == undefined
                ? "Not available"
                : movieDetails.Website
            }</li>
          </ul>
        </div>
      </div>`;

    var ratings = document.querySelector(".ratings");
    if (movieDetails.Ratings) {
      var ratingsList = document.createElement("ul");
      for (let i = 0; i < movieDetails.Ratings.length; i++) {
        var ratingsChild = document.createElement("li");
        ratingsChild.innerHTML = `${movieDetails.Ratings[i].Source}:${movieDetails.Ratings[i].Value}`;
        ratingsList.appendChild(ratingsChild);
      }
      ratings.appendChild(ratingsList);
    }

    var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));
    var favBtn = document.querySelector(`.fav-btn${movieDetails.imdbID}`);

    if (favouritesArray) {
      if (!favouritesArray.includes(movieDetails.imdbId)) {
        favBtn.innerHTML = "<span>Add to favourite</span>";
      } else {
        favBtn.innerHTML = "<span>Favourite</span>";
      }
    }

    favBtn.addEventListener("click", () =>
      addToFavourite(favBtn, movieDetails.imdbID)
    );
  }

  // addToFavourite function same as index.js
  function addToFavourite(favBtn, id) {
    var favouritesArray = JSON.parse(myLocalStorage.getItem("favourites"));
    var favBtn = document.querySelector(`.fav-btn${id}`);
    if (favouritesArray) {
      if (favouritesArray.includes(id)) {
        favBtn.innerText = "Add to favourite";
        favouritesArray.splice(favouritesArray.indexOf(id), 1);
      } else {
        favBtn.innerText = "Favourite";
        favouritesArray.push(id);
      }
    } else {
      var array = [];
      array.push(id);
      favouritesArray = array;
    }

    myLocalStorage.setItem("favourites", JSON.stringify(favouritesArray));
  }
}
