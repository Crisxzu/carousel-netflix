import { startCase } from "lodash";
import "./sass/mains.scss";
import netflixLogoImg from "./netflix-logo.png";
import netflixApi from "./netflixApi";
import HamburgerMenu from "./hamburgerMenu";
import CardCarousels from "./cardCarousel";


let movieDialog = document.querySelector('.movie-dialog');
let hamburgerMenu;
let cardCarousels;

/** Updates page for responsive purposes on screen resizes
 * @see HamburgerMenu
 * @see CardCarousels
*/
function updatePage()
{    
    if(!hamburgerMenu.hamburgerImgChanged)
    {
        hamburgerMenu.updateHamburger();        
    }
    else
    {
        hamburgerMenu.hamburgerImgChanged = false;
    }
    for (let index = 0; index < cardCarousels.getLength(); index++) 
    {
        cardCarousels.updateCardCarousel(index);
    }
}


/** Initializes Netflix logo*/
function initNetflixLogo()
{
    let netflixLogo = document.querySelector('.netflix-logo');
    netflixLogo.src = netflixLogoImg;
}

/** Initializes sections of movies with informations from API
 * @async
 * @see onClickCard
 * @see netflixApi 
*/
async function initMoviesSection()
{
    let moviesSections = document.querySelectorAll('section');
    for(let i = 0; i < moviesSections.length; i++)
    {
        let moviesSection = moviesSections[i];
        let movies = [];
        let sectionTitle;
        if(moviesSection.classList.contains('best-movies'))
        {
            movies = await netflixApi.getBestMovies(); // Todo: Await inutile
            sectionTitle = 'Best Movies';            
        }
        else
        {
            movies = await netflixApi.getMoviesByGenre(moviesSection.classList[0]); //Todo: await inutile
            sectionTitle = moviesSection.classList[0];
        }
        if(movies.length > 0)
        {
            let h1 = document.createElement('h1');
            h1.classList.add('category-title');
            h1.innerText = startCase(sectionTitle);
            moviesSection.appendChild(h1);

            let cardCarousel = document.createElement('div');
            cardCarousel.classList.add('card-carousel');

            movies.forEach(movie => {
                let card = document.createElement('div');
                card.classList.add('card');
                card.id = movie.id;
                card.style.backgroundImage = `url(${movie.imageUrl})`;
                card.onclick = onClickCard;
                cardCarousel.appendChild(card);   
            });
            let prev = document.createElement('a');
            prev.classList.add('prev');
            prev.textContent = "<";
            cardCarousel.appendChild(prev);


            let next = document.createElement('a');
            next.classList.add('next');
            next.textContent = ">";
            cardCarousel.appendChild(next);
            moviesSection.appendChild(cardCarousel);
        }
    } 
}

/** Show movie dialog with informations about the movie on click event on card 
 * @async
*/
async function onClickCard(e)
{
    let card = e.target;
    let id = card.id;
    let movie = await netflixApi.getMovieById(id);
    
    if(movie)
    {
        let img = movieDialog.querySelector('img');
        img.src = movie.imageUrl;

        let title = movieDialog.querySelector('.title');
        title.innerText = movie.title;

        let year = movieDialog.querySelector('.year');
        year.innerText = "Year: " + movie.year;

        let imdbScore = movieDialog.querySelector('.imdb-score');
        imdbScore.innerText = "ImDb Score: " + movie.imdbScore;

        let votes = movieDialog.querySelector('.votes');
        votes.innerText = "Votes: " + movie.votes;

        let directors = movieDialog.querySelector('.directors');
        directors.innerText = "Directed by: " + movie.directors.join(', ');

        let writers = movieDialog.querySelector('.writers');
        writers.innerText = "Written by: " + movie.writers.join(', ');

        let actors = movieDialog.querySelector('.actors');
        actors.innerText = "Actors: " + movie.actors.join(', ');

        let genres = movieDialog.querySelector('.genres');
        genres.innerText = "Genres: " + movie.genres.join(', ');

        let closeButton = movieDialog.querySelector('.close');
        closeButton.onclick = function() {
            movieDialog.close();
        };

        movieDialog.showModal();
    }
}


initNetflixLogo();
await initMoviesSection();
hamburgerMenu = new HamburgerMenu(document.querySelector('.hamburger'), document.querySelector('.navbar'));
cardCarousels = new CardCarousels(document.querySelectorAll('.card-carousel'));
updatePage();

let resizeObserver = new ResizeObserver(updatePage);
resizeObserver.observe(document.body);

