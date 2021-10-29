const botoes = document.querySelectorAll('#btn');
const movies = document.querySelector('.movies');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalRating = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');
const input = document.querySelector('.input');
const linkVideo = document.querySelector('.highlight__video');
const hightlightGenres = document.querySelector('.highlight__genres');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightDescription = document.querySelector('.highlight__description');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightVideo = document.querySelector('.highlight__video');
const highlightVideoLink = document.querySelector('.highlight__video-link');
const bodyPage = document.querySelector('body');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR').then(async response => {
    const resposta = await response.json();
    let dados = resposta;
    selecionarCartaz(0, resposta);

    botoes.forEach(btn => {
        btn.addEventListener('click', function (event) {
            scrollList(event, dados);
        });
    })

    function selecionarCartaz(index, data) {
        const quantidade = data.results.length >= 5 ? 5 : data.results.length;
        dados = data;
        for (let i = 0; i < quantidade; i++) {
            const movieId = data.results[index].id;
            const moviePosterPath = data.results[index].poster_path;
            const title = data.results[index].title;
            const rating = data.results[index].vote_average;
            const divMovie = document.createElement('div');
            const divMovieInfo = document.createElement('div');
            const spanMovieTitle = document.createElement('span');
            const spanMovieRating = document.createElement('span');
            const starImg = document.createElement('img');

            divMovie.id = movieId;
            divMovie.classList.add('movie');
            divMovieInfo.classList.add('movie__info');
            spanMovieTitle.classList.add('movie__title');
            spanMovieRating.classList.add('movie__rating');

            starImg.src = './assets/estrela.svg';
            starImg.style.setProperty('margin-right', '5px');
            divMovie.style.setProperty('background-image', `url('https://image.tmdb.org/t/p/w185${moviePosterPath}')`);

            spanMovieTitle.append(title);
            spanMovieRating.append(starImg, rating);
            divMovieInfo.append(spanMovieTitle, spanMovieRating);
            divMovie.append(divMovieInfo);
            movies.append(divMovie);
            divMovie.addEventListener('click', abrirModal);
            index++;
        }
    }
    async function abrirModal() {
        const movieId = this.id;
        modal.classList.remove('hidden');
        modalClose.addEventListener('click', fecharModal);
        modal.addEventListener('click', fecharModal);
        const modalMovie = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movieId}?language=pt-BR`)).json();

        modalTitle.textContent = modalMovie.title;
        modalImg.src = modalMovie.backdrop_path;
        modalDescription.textContent = modalMovie.overview;
        modalRating.textContent = modalMovie.vote_average;
        modalMovie.genres.forEach(genre => {
            const spanGenre = document.createElement('span');
            spanGenre.classList.add('modal__genre');
            spanGenre.textContent = genre.name;
            modalGenres.append(spanGenre);
        })
    }

    function fecharModal() {
        modal.classList.add('hidden');
        const quantidade = modalGenres.children.length;
        for (let i = 0; i < quantidade; i++) {
            modalGenres.lastChild.remove();
        }
    }

    function apagarDivs() {
        const quantidade = movies.children.length;
        for (let i = 0; i < quantidade; i++) {
            movies.lastChild.remove();
        }
    }

    function updateMovies(index, data) {
        apagarDivs();
        selecionarCartaz(index, data);
    }

    function scrollList(event, data) {
        const imagem4 = `"https://image.tmdb.org/t/p/w185${data.results[4].poster_path}"`;
        const imagem9 = `"https://image.tmdb.org/t/p/w185${data.results[9].poster_path}"`;
        const imagem14 = `"https://image.tmdb.org/t/p/w185${data.results[14].poster_path}"`;
        const imagem19 = `"https://image.tmdb.org/t/p/w185${data.results[19].poster_path}"`;
        const lastImgsrc = movies.lastChild.style.backgroundImage;

        if (lastImgsrc === `url(${imagem4})`) {
            event.target.className === 'btn-next' ? updateMovies(5, data) : updateMovies(15, data);
        } else if (lastImgsrc === `url(${imagem9})`) {
            event.target.className === 'btn-next' ? updateMovies(10, data) : updateMovies(0, data);
        } else if (lastImgsrc === `url(${imagem14})`) {
            event.target.className === 'btn-next' ? updateMovies(15, data) : updateMovies(5, data);
        } else if (lastImgsrc === `url(${imagem19})`) {
            event.target.className === 'btn-next' ? updateMovies(0, data) : updateMovies(10, data);
        }
    }
    input.addEventListener('keydown', async function (event) {
        if (event.key !== 'Enter') {
            return;
            updateMovies(0, resposta);
        }
        if (!event.target.value) {
            return;
        }
        const movieToBeFind = event.target.value;
        const findedMovie = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${movieToBeFind}`)).json();
        updateMovies(0, findedMovie);
        event.target.value = '';
    });
})
fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(async response => {
    const resposta = await response.json();
    const movieResponse = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR')).json();
    const keyVideo = movieResponse.results[1].key;
    const month = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    const highlightPath = resposta.backdrop_path;
    const date = new Date(resposta.release_date);
    const formatedDate = ((date.getDay() + 'DE' + month[date.getMonth()] + 'DE' + date.getFullYear()));

    for (let i = 0; i < resposta.genres.length; i++) {
        const colocarVirgula = i === 0 ? '' : ', ';
        hightlightGenres.textContent += `${colocarVirgula} ` + resposta.genres[i].name;
    }
    highlightVideo.style.setProperty('background-image', `url("${highlightPath}")`);
    highlightLaunch.textContent = formatedDate;
    highlightTitle.textContent = resposta.title;
    highlightRating.textContent = resposta.vote_average;
    highlightDescription.textContent = resposta.overview;
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${keyVideo}`;
})

const theme = document.querySelector('.btn-theme');
let atualTheme = localStorage.getItem('tema');

bodyPage.style.setProperty('--background-color', atualTheme === 'escuro' ? '#111' : '#fff');
bodyPage.style.setProperty('--color', atualTheme === 'escuro' ? '#fff' : '#000');
bodyPage.style.setProperty('--highlight-background', atualTheme === 'escuro' ? '#333' : '#fff');
bodyPage.style.setProperty('--highlight-description', atualTheme === 'escuro' ? '#fff' : '#000');
bodyPage.style.setProperty('--highlight-color', atualTheme === 'escuro' ? '#fff' : 'rgba(0, 0, 0, 0.7)');

if (atualTheme === 'claro' || atualTheme === null) {
    localStorage.setItem('tema', 'claro');
    theme.src = './assets/light-mode.svg';
    btnPrev.src = './assets/seta-esquerda-preta.svg';
    btnNext.src = './assets/seta-direita-preta.svg';
} else {
    theme.src = './assets/dark-mode.svg';
    btnPrev.src = './assets/seta-esquerda-preta.svg';
    btnNext.src = './assets/seta-direita-preta.svg';
}

theme.addEventListener('click', function () {
    if (localStorage.getItem('tema') === 'claro') {
        console.log('claro');
        localStorage.setItem('tema', 'escuro');

        theme.src = './assets/dark-mode.svg';
        bodyPage.style.setProperty('--background-color', '#111');
        bodyPage.style.setProperty('--color', '#fff');

        bodyPage.style.setProperty('--highlight-background', '#333');
        bodyPage.style.setProperty('--highlight-description', '#fff');
        bodyPage.style.setProperty('--highlight-color', '#fff');
        btnPrev.src = './assets/seta-esquerda-branca.svg';
        btnNext.src = './assets/seta-direita-branca.svg';
    } else {
        console.log('escuro');
        localStorage.setItem('tema', 'claro');

        theme.src = './assets/light-mode.svg';
        bodyPage.style.setProperty('--background-color', '#fff');
        bodyPage.style.setProperty('--color', '#000');

        bodyPage.style.setProperty('--highlight-background', '#fff');
        bodyPage.style.setProperty('--highlight-description', '#000');
        bodyPage.style.setProperty('--highlight-color', 'rgba(0, 0, 0, 0.7)');
        btnPrev.src = './assets/seta-esquerda-preta.svg';
        btnNext.src = './assets/seta-direita-preta.svg';
    }
});