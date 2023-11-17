// Javascript code goes here :
// API Connection
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "f531333d637d0c44abc85b3e74db2186"; // Replace with your actual API key

const fetchMoviesfromAPI = async () => {
  try {
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
