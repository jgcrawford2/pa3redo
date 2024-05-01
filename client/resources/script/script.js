let movieURL = "http://localhost:5239/swagger";
let movies = [];
let currentMovie;

async function handleOnLoad() {
  movies = await getAllMovies();
  await fillTable();
}

async function getAllMovies() {
  let response = await fetch(movieURL);
  let movieData = await response.json();
  return movieData;
}


document.addEventListener('DOMContentLoaded', function() {
    const movieList = document.getElementById('movie-list');
    const addMovieForm = document.getElementById('add-movie-form');
    let movies = JSON.parse(localStorage.getItem('movies')) || [];

    function displayMovies() {
        movieList.innerHTML = '';
        movies
            .filter(movie => !movie.deleted)
            .sort((a, b) => b.rating - a.rating)
            .forEach(movie => {
                const li = document.createElement('li');
                li.textContent = `${movie.name}, ${movie.rating}, ${movie.releaseDate}`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function() {
                    deleteMovie(movie.id);
                });
                li.appendChild(deleteButton);
                movieList.appendChild(li);
            });
    }

    movieList.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            const movieId = parseInt(event.target.parentElement.dataset.movieId);
            deleteMovie(movieId);
        }
    });

    addMovieForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const movieName = document.getElementById('movie-name').value;
        const rating = document.getElementById('rating').value;
        const releaseDate = document.getElementById('release-date').value;
        movies.push({
            id: movies.length + 1,
            name: movieName,
            rating: rating,
            releaseDate: releaseDate,
            favorited: false,
            deleted: false
        });
        localStorage.setItem('movies', JSON.stringify(movies));
        displayMovies();
        addMovieForm.reset();
    });

    function deleteMovie(movieId) {
        const movieIndex = movies.findIndex(movie => movie.id === movieId);
        movies[movieIndex].deleted = true;
        localStorage.setItem('movies', JSON.stringify(movies));
        displayMovies();
    }

    displayMovies();

    function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
        if (localStorageTheme !== null) {
            return localStorageTheme;
        }
        
        if (systemSettingDark.matches) {
            return "dark";
        }
        
        return "light";
    }

    function updateButton({ buttonEl, isDark }) {
        const newCta = isDark ? "Change to light theme" : "Change to dark theme";
        buttonEl.setAttribute("times-label", newCta);
        buttonEl.innerText = newCta;
    }
    function updateThemeOnHtmlEl({ theme }) {
        document.querySelector("html").setAttribute("data-theme", theme);
    }

    const button = document.querySelector("[data-theme-toggle]");
    const localStorageTheme = localStorage.getItem("theme");
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

    let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

    updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
    updateThemeOnHtmlEl({ theme: currentThemeSetting });

    button.addEventListener("click", (event) => {
        const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

        localStorage.setItem("theme", newTheme);
        updateButton({ buttonEl: button, isDark: newTheme === "dark" });
        updateThemeOnHtmlEl({ theme: newTheme });

        currentThemeSetting = newTheme;
    }); 
});
