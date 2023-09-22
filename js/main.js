const apiKey = "aaee8ccb8dc6be6d0b5568020a05c876";

const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES`;
const galeria = document.getElementById('galeria');

const totalPages = 15;
const moviesContainer = galeria;

// Función para hacer una solicitud y procesar una página de resultados
function fetchMoviesByPage(page) {
    return fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}&language=es-ES`)
    .then(respuesta => respuesta.json());
}

// Función para obtener todas las páginas de resultados de películas
function fetchAllMovies() {
    const promises = [];
    for (let page = 1; page <= totalPages; page++) {
        promises.push(fetchMoviesByPage(page));
    }

    return Promise.all(promises)
        .then(pages => {
        // pages contiene un arreglo de resultados de cada página
        const allMovies = pages.reduce((accumulator, currentPage) => {
            return accumulator.concat(currentPage.results);
        }, []);

        return allMovies;
        });
}

// Función para crear tarjetas de película y agregarlas al contenedor
function createMovieCards(movies) {
    movies.forEach(movie => {
      // Verificar si la película tiene una imagen
        if (movie.backdrop_path) {
        // Crear elementos HTML para la tarjeta de película
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('movie-card');

        const cardImage = document.createElement('img');
        cardImage.src = `https://image.tmdb.org/t/p/w300/${movie.backdrop_path}`;
        cardImage.alt = '';

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('descripcion-card');

        const cardTitle = document.createElement('h2');
        cardTitle.classList.add('titulo-card');
        cardTitle.textContent = movie.title;

        const cardButton = document.createElement('button');
        cardButton.setAttribute('id','btn-verMas')
        cardButton.classList.add('btn-12');
        cardButton.innerHTML = '<span>Ver más</span>';

        // Agregar elementos a la tarjeta de película
        cardDescription.appendChild(cardTitle);
        cardDescription.appendChild(cardButton);

        cardContainer.appendChild(cardImage);
        cardContainer.appendChild(cardDescription);

        // Agregar la tarjeta de película al contenedor
        moviesContainer.appendChild(cardContainer);
        }
    });
}

// Llamar a la función para obtener todas las películas populares y crear las tarjetas
fetchAllMovies()
    .then(allMovies => {
    createMovieCards(allMovies);
    })
    .catch(error => {
    console.error('Error al obtener películas:', error);
    });v