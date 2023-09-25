const apiKey = "aaee8ccb8dc6be6d0b5568020a05c876";

const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES`;
const galeria = document.getElementById('galeria');

const totalPages = 15;
const moviesContainer = galeria;

//Lista de Favoritos
const favoritesList = [];

// Función para hacer una solicitud y procesar una página de resultados
function fetchMoviesByPage(page) {
    return fetch(`https://api.themoviedb.org/3/movie/popular?include_adult=false&api_key=${apiKey}&page=${page}&language=es-ES`)
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
                const filteredMovies = currentPage.results.filter(movie => !movie.adult);
                return accumulator.concat(filteredMovies);
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
            cardImage.alt = `${movie.title}`;

            const cardDescription = document.createElement('div');
            cardDescription.classList.add('descripcion-card');

            const cardTitle = document.createElement('h2');
            cardTitle.classList.add('titulo-card');
            cardTitle.textContent = movie.title;

            const cardButton = document.createElement('button');
            cardButton.setAttribute('id', 'btn-verMas')
            cardButton.classList.add('btn-12');
            cardButton.innerHTML = '<span>Ver Mas</span>';

            const favoriteButton = document.createElement('button');
            favoriteButton.classList.add('btnFav');
            favoriteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"  width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>`;

            //Agregar evento al boton favorito
            favoriteButton.addEventListener('click', () =>{
                const favorito = favoritesList.some(favorite => favorite.id === movie.id);

                if(!favorito){
                    favoritesList.push(movie);
                    favoriteButton.classList.remove('btnFav');
                    favoriteButton.classList.add('btnFavActivado');
                }else{
                    alert('Este titulo ya esta en favoritos');
                }
            })
            // Agregar evento al boton Ver Mas
            cardButton.addEventListener('click', () => {
                moviesContainer.innerHTML = ''
                displayMovieDescription(movie);
            });
            // Agregar elementos a la tarjeta de película
            cardDescription.appendChild(cardTitle);
            cardDescription.appendChild(cardButton);
            cardDescription.appendChild(favoriteButton);

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
    });


//Buscador

const form = document.getElementById('form');
const searchInput = document.getElementById('search');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        // Llamar a una función para buscar películas usando searchTerm
        searchMovies(searchTerm);
    }
});

function searchMovies(searchTerm) {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}&language=es-ES`;

    fetch(searchUrl)
        .then(respuesta => respuesta.json())
        .then(data => {
            // Procesar los resultados de la búsqueda y mostrarlos en la página
            displaySearchResults(data.results);
        })
        .catch(error => {
            console.error('Error al buscar películas:', error);
        });
}
function displaySearchResults(results) {
    // Limpia los resultados anteriores
    moviesContainer.innerHTML = '';

    // Crea tarjetas de película para los resultados de la búsqueda
    createMovieCards(results);
}

//Mostrar la descripcion de la pelicula seleccionada
function displayMovieDescription(movie) {
    const descripcionPelicula = document.getElementById('descripcion-pelicula');
    
    //Creamos la imagen de la pelicula
    const descripcionImagen = document.createElement('IMG');
    descripcionImagen.src = `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`;
    descripcionImagen.classList.add('descripcion-img');
    descripcionImagen.alt = movie.title;

    //Creacion del titulo de la seccion
    const descripcionTitulo = document.createElement('H3');
    descripcionTitulo.textContent= `${movie.title}`;
    descripcionTitulo.classList.add('descripcionTitulo');

    //Creacion del parrafo descripcion de la pelicula
    const descripcionParrafo = document.createElement('P');
    descripcionParrafo.innerHTML = movie.overview;
    descripcionParrafo.classList.add('descripcionParrafo');

    //Creacion del boton volver
    const btnVolver = document.createElement('A');
    btnVolver.textContent = 'Volver';
    btnVolver.href='#';
    btnVolver.classList.add('btnVolver');
    btnVolver.setAttribute('id', 'btnVolver');

    //Agregamos los elementos a la pagina de Descripcion
    descripcionPelicula.appendChild(descripcionImagen);
    descripcionPelicula.appendChild(descripcionTitulo);
    descripcionPelicula.appendChild(descripcionParrafo);
    descripcionPelicula.appendChild(btnVolver);

    //Ocultar la lista de todas las peliculas
    galeria.style.display = 'none';
    const botonVolver = document.getElementById('btnVolver');

botonVolver.addEventListener('click',(event) => {
    event.preventDefault();
    descripcionPelicula.innerHTML = '';
    galeria.style.display = 'grid';

    fetchAllMovies()
        .then(allMovies =>{
            createMovieCards(allMovies);
        })
        .catch(error =>{
            alert('Error al obtener las peliculas',error)
        })
}
)
}

function displayFavorites() {
    // Obtener el elemento donde mostrar los favoritos
    const favoritesContainer = document.getElementById('favoritos');

    // Limpiar el contenido anterior
    favoritesContainer.innerHTML = '';

    // Crear tarjetas de película para las películas favoritas
    createMovieCards(favoritesList);

    // Puedes agregar estilos CSS y más detalles según tus necesidades
}
const mostrarFavoritosButton = document.getElementById('mostrarFavoritos');

mostrarFavoritosButton.addEventListener('click', () => {
    if (favoritesList === []){
        alert("No hay ninguna pelicula en tu lista");
    }
    
    galeria.style.display = 'none';
    displayFavorites();
});