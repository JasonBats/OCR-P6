function closeModal() {
    var modal = document.getElementById("myModal");

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
fetch(`http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=2`)
    .then((response) => response.json())
    .then((data) => {
        const bestMovieList = data.results;
        let bestMovie = bestMovieList[0]
        let backgroundImage = bestMovie.image_url
        let backgroundImageStart = backgroundImage.slice(0, -28)
        let backgroundImageEnd = backgroundImage.slice(-4)
        let finalBackgroundImage = backgroundImageStart.concat(backgroundImageEnd)
        let mainMovie = document.getElementById('best-movie')
        fetch(`http://127.0.0.1:8000/api/v1/titles/${bestMovie.id}`)
            .then((response) => response.json())
            .then((data) => {
                const bestMovieDetails = data.results;
        mainMovie.innerHTML +=
            '<div class="main-movie">\n' +
            `<h1>${bestMovie.title}</h1>` +
            `<div id="best-movie-description">${data.description}</div>` +
            '<button id="info-btn">Infos</button>'
            '</div>'
        let infoBtn = document.getElementById('info-btn')
        infoBtn.addEventListener('click', () => {
            openModal(bestMovie)
        })
        mainMovie.style.backgroundImage = `url('${finalBackgroundImage}')`;
    })
})

fetch(`http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7`)
    .then((response) => response.json())
    .then((data) => {
        const bestMovies = data.results;

        let main_section = document.getElementById('Best movies')
        main_section.innerHTML += '<h2>Films les mieux notés</h2>'
        main_section.innerHTML +=
            `<section class="wrapper">\n` +
            `<div class="overlay-previous"><img class="fill" alt="angle-left" src="images/angle-left-solid.svg"></div>\n` +
            `   <section class="category" id="Best movies">\n` +
            '       <div class="movie"></div>\n'.repeat(7) +
            '   </section>\n' +
            '   <div class="overlay-next"><img class="fill" alt="angle-right" src="images/angle-right-solid.svg"></div>\n' +
            '</section>';
        let section = document.getElementById("Best movies")
        let movieDivs = section.querySelectorAll('.movie');
        bestMovies.forEach((movieItem, index) => {
            movieDivs[index].id = `${movieItem.id}`
            movieDivs[index].style.backgroundImage = `url('${movieItem.image_url}')`;
            movieDivs[index].innerHTML = `<div id="movie-title"><h3>${movieItem.title}</h3></div>`;
            movieDivs[index].addEventListener('click', () => {
                openModal(movieItem);
            })
        })
        slideRightMovieCategory()
    })

fetch("http://127.0.0.1:8000/api/v1/genres/?page_size=100")
  .then((response) => response.json())
  .then((data) => {
      const genres = data.results;
      const selectedGenres = genres.filter(item =>
          item.name === 'Action' || item.name === 'Biography' || item.name === 'Romance'
      );

      selectedGenres.forEach(item => {
          let main_section = document.getElementsByTagName("main")[0];
          main_section.innerHTML += `<h2>${item.name}</h2>`;
          main_section.innerHTML +=
              `<section class="wrapper">\n` +
              `<div class="overlay-previous"><img class="fill" alt="angle-left" src="images/angle-left-solid.svg"></div>\n` +
              `   <section class="category" id="${item.name}">\n` +
              '       <div class="movie"></div>\n'.repeat(7) +
              '   </section>\n' +
              '   <div class="overlay-next"><img class="fill" alt="angle-right" src="images/angle-right-solid.svg"></div>\n' +
              '</section>';

          fetch(`http://127.0.0.1:8000/api/v1/titles/?genre=${item.name}&sort_by=-votes&page=1&page_size=7`)
            .then ((response) => response.json())
            .then((moviesData) => {
                const titles = moviesData.results;
                let section = document.getElementById(item.name);
                let movieDivs = section.querySelectorAll('.movie');

                titles.forEach((movieItem, index) => {
                        movieDivs[index].id = `${movieItem.id}`
                        movieDivs[index].style.backgroundImage = `url('${movieItem.image_url}')`;
                        movieDivs[index].innerHTML = `<div id="movie-title"><h3>${movieItem.title}</h3></div>`;
                        movieDivs[index].addEventListener('click', () => {
                            openModal(movieItem);

                });
                closeModal();
            })
      });
  })
  // slideRightMovieCategory()
  })

function openModal(movieItem) {
    fetch(`http://127.0.0.1:8000/api/v1/titles/${movieItem.id}`)
        .then((response) => response.json())
        .then((movieDetails) => {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    modal.innerHTML = `<div class="modal-content">
        <span class="close">&times;</span>
        <img alt="Pochette de ${movieDetails.title}" src="${movieDetails.image_url}"></img>
        <h3>${movieDetails.title}</h3>
        <section>
            <p><b>Genre</b> : ${movieDetails.genres}</p>
            <p><b>Sorti le</b> : ${movieDetails.date_published}</p>
            <p><b>Rated</b> : ${movieDetails.rated}</p>
            <p><b>Score IMDB</b> : ${movieDetails.imdb_score}</p>
            <p><b>Réalisateur</b> : ${movieDetails.directors}</p>
            <p><b>Acteurs</b> : ${movieDetails.actors}</p>
            <p><b>Temps</b> : ${movieDetails.duration} minutes</p>
            <p><b>Pays d'origine(s)</b> : ${movieDetails.countries}</p>
            <p><b>Résultat au box-office</b> : ${movieDetails.worldwide_gross_income}</p>
            <p><b>Résumé</b> : ${movieDetails.long_description}</p>
        </section>
        </div>`
        const close = document.getElementsByClassName('close')[0]
        close.addEventListener('click', () => {
            modal.style.display = 'none'
        })
    })
}

function slideRightMovieCategory() {
    let anglesRight = document.getElementsByClassName('overlay-next')
    let anglesLeft = document.getElementsByClassName('overlay-previous')
    for(let i=0; i<anglesRight.length;i++){
        anglesRight[i].addEventListener('click', (event) => {
            let parent = event.target.parentElement
            console.log(event)
            parent.children[1].scrollLeft += 250;
        })
    }
    for(let i=0; i<anglesLeft.length;i++){
        anglesLeft[i].addEventListener('click', (event) => {
            let parent = event.target.parentElement
            console.log(event)
            parent.children[1].scrollLeft -= 250;
        })
    }

}