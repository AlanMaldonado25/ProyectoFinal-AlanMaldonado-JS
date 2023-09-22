const apiKey = "aaee8ccb8dc6be6d0b5568020a05c876";

const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES`;
const galeria = document.getElementById('galeria');

// fetch(apiUrl)
//     .then(response => response.json())
//     .then(data => {
//         const card = document.createElement('DIV');
//         card.classList.add('card');
//         card.innerHTML = `<img src="${'https://image.tmdb.org/t/p/w300/8pjWz2lt29KyVGoq1mXYu6Br7dE.jpg'}" alt="" class="img-card">
//         <div class="descripcion-card">
//             <h2 class="titulo-card">${data.results[3].title}</h2>
//             <p class="parrafo-card">${data.results[3].overview}</p>
//             <button class="ui-btn">
//                 <span>
//                     Ver mas
//                 </span>
//             </button>
//         </div>`
//         galeria.appendChild(card);

//         console.log(data.results[3])

//     });
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const galeria = document.getElementById('galeria'); // Obtén la referencia al contenedor "galeria" en tu HTML
        const results = data.results; // Array de películas en la respuesta

        // Itera a través de los resultados y crea una tarjeta para cada película
        results.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w300/${movie.backdrop_path}" alt="" class="img-card">
                <div class="descripcion-card">
                    <h2 class="titulo-card">${movie.title}</h2>
                    <p class="parrafo-card">${movie.overview}</p>
                    <button class="ui-btn">
                        <span>Ver más</span>
                    </button>
                </div>
            `;

            // Agrega la tarjeta al contenedor "galeria"
            galeria.appendChild(card);
        });
        console.log(results)
    });
