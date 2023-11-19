// Javascript code goes here :
// API Connection
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "f531333d637d0c44abc85b3e74db2186";

// const headers = {
//   Authorization: "Bearer " + TMDB_TOKEN,
// };

const fetchMoviesfromAPI = async () => {
  try {
    // const queryString = params
    //   ? "?" + new URLSearchParams(params).toString()
    //   : "";

    // // Make the fetch request
    // const response = await fetch(BASE_URL + url + queryString, {
    //   headers,
    // });

    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// title <---Element
// vote_count <-- element
// vote_average <--- element
// poster --> poster_path

function renderMovies(data) {
  const movieULlist = document.querySelector("#movies-list");
  movieULlist.innerHTML = ""; // Clear existing content

  data?.map((item) => {
    console.log(item);

    const posterUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/original/${item.poster_path}`
      : `https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png`;

    movieULlist.innerHTML += `
    <li class='card'>
    <img class="poster" src=${posterUrl} alt="movie-title" />

      <p class='title'>${item.title}</p>
      <section class='vote-favoriteIcon'>
        <section class='vote'>
          <p class='vote-count'>Votes: ${item.vote_count}</p>
          <p class='vote-average'>Rating: ${item.vote_average}</p>
        </section>
         <i class="fa-regular fa-heart fa-2xl" id="favorite-icon"></i>
      </section>
    </li>
   `;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const movies = await fetchMoviesfromAPI();
  renderMovies(movies);
});

console.log(window);

/* Sort */

let moviesData; // Global variable to store the fetched movies data

// Sorting options
const sortByDateButton = document.getElementById("sort-by-date");
const sortByRatingButton = document.getElementById("sort-by-rating");

sortByDateButton.addEventListener("click", () => {
  sortMoviesBy("release_date");
});

sortByRatingButton.addEventListener("click", () => {
  sortMoviesBy("vote_average");
});

function sortMoviesBy(key) {
  moviesData.sort((a, b) => {
    if (key === "release_date") {
      return new Date(b.release_date) - new Date(a.release_date);
    } else if (key === "vote_average") {
      return b.vote_average - a.vote_average;
    }
  });
  renderMovies(moviesData);
}

/*Search */

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", async () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    const searchedMovies = await searchMovies(searchTerm);
    renderMovies(searchedMovies);
  }
});

async function searchMovies(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* Add Fav*/

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

document.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("fa-heart")) {
    const movieIndex =
      target.parentElement.parentElement.parentElement.dataset.index;
    toggleFavorite(movieIndex);
  }
});

function toggleFavorite(index) {
  const movie = moviesData[index];

  if (favorites.some((fav) => fav.id === movie.id)) {
    favorites = favorites.filter((fav) => fav.id !== movie.id);
  } else {
    favorites.push(movie);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderMovies(moviesData);
}

// Modify renderMovies function to show favorites
function renderMovies(data) {
  // ... existing code ...

  data?.map((item, index) => {
    const isFavorite = favorites.some((fav) => fav.id === item.id);

    // ... existing code ...

    movieULlist.innerHTML += `
      <li class='card' data-index=${index}>
        <img class="poster" src=${posterUrl} alt="movie-title" />
        <p class='title'>${item.title}</p>
        <section class='vote-favoriteIcon'>
          <section class='vote'>
            <p class='vote-count'>Votes: ${item.vote_count}</p>
            <p class='vote-average'>Rating: ${item.vote_average}</p>
          </section>
          <i class="fa-regular fa-heart fa-2xl ${
            isFavorite ? "favorite" : ""
          }" id="favorite-icon"></i>
        </section>
      </li>
    `;
  });
}

// Update DOMContentLoaded event
document.addEventListener("DOMContentLoaded", async () => {
  moviesData = await fetchMoviesfromAPI();
  renderMovies(moviesData);
});

/* Fav Tab */

const favoritesTab = document.getElementById("favorites-tab");

favoritesTab.addEventListener("click", () => {
  renderMovies(favorites);
  setActiveTab(favoritesTab);
});

// Add setActiveTab function
function setActiveTab(tab) {
  const tabs = document.querySelectorAll(".tabs button");
  tabs.forEach((t) => t.classList.remove("active-tab"));
  tab.classList.add("active-tab");
}

/* Pagination */

let currentPage = 1;

const prevButton = document.getElementById("prev-button");
const pageNumberButton = document.getElementById("page-number-button");
const nextButton = document.getElementById("next-button");

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updatePage();
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < 3) {
    currentPage++;
    updatePage();
  }
});

function updatePage() {
  pageNumberButton.innerText = `Current Page: ${currentPage}`;
  // Fetch movies for the new page
  const startIndex = (currentPage - 1) * 20;
  const endIndex = startIndex + 20;
  renderMovies(moviesData.slice(startIndex, endIndex));
  // Disable/enable buttons based on current page
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === 3;
}

// Call updatePage initially to set up the first page
updatePage();
