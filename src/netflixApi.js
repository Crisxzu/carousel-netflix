class Movie
{
    id;
    imdbUrl;
    title;
    year;
    imdbScore;
    votes;
    imageUrl;
    directors;
    writers;
    actors;
    genres;

    /** Constructs Movie object with some data 
     * @constructor
     * @param {number} id - Movie id
     * @param {string} imdbUrl - Movie ImDb url
     * @param {string} title - Movie title
     * @param {number} year - Movie year of release
     * @param {number} imdbScore - Movie ImDb score
     * @param {number} votes - Number of votes
     * @param {string} imageUrl - Movie image url
     * @param {Array} directors - Movie directors
     * @param {Array} writers - Movie writers
     * @param {Array} actors - Movie actors
     * @param {Array} genres - Movie genres
    */
    constructor(id, imdbUrl, title, year, imdbScore, votes, imageUrl, directors, writers, actors, genres)
    {
        this.id = id;
        this.imdbUrl = imdbUrl;
        this.title = title;
        this.year = year;
        this.imdbScore = imdbScore;
        this.votes = votes;
        this.imageUrl = imageUrl;
        this.directors = directors;
        this.writers = writers;
        this.actors = actors;
        this.genres = genres;
    }
}

/** Check if image on a url is available
 * @async
 * @param {string} imageUrl - Image url
 * @returns {boolean} - True if image is available, false otherwise
*/
async function isImageAvailable(imageUrl) 
{
    try 
    {
        let response = await fetch(imageUrl);
        return response.ok; 
    } catch (error) 
    {
        return false;
    }
}

/** Get movies by genre(with image available)
 * @async
 * @param {string} genre - Movie genre
 * @param {number} limit - Maximum number of movies to be returned(default is 10)
 * @returns {Array} - Array of movies
 * @see isImageAvailable
 * @see Movie
 * @see {@link https://github.com/cGIfl300/OC_P6/tree/master/cloned_api_server/OCMovies-API-EN-FR APIGit} //Todo: Mauvais usage, pas de curly brackets, c'est un link, pas un paramètre de type link (qui n'existe pas)
*/
async function getMoviesByGenre(genre, limit = 10)
{   
    let movies = [];
    let nbMoviesObtained = 0;    
    let response = await fetch("http://localhost:8000/api/v1/titles/?genre=" + genre);

    while(nbMoviesObtained < limit)
    {    
        if (response.ok)
        {
            let json = await response.json();
            let results = json["results"];

            for(let j = 0; j < results.length; j++)
            {
                let result = results[j]; // Todo: Utiliser const, car c'est un immutable
                const movie = new Movie(
                    result["id"],
                    result["imdb_url"], 
                    result["title"],
                    result["year"],
                    result["imdb_score"],
                    result["votes"],
                    result["image_url"],
                    result["directors"],
                    result["writers"],
                    result["actors"],
                    result["genres"]);                
                let isAvailable = await isImageAvailable(movie.imageUrl); // Todo: await inutile, ta fonction ne retourne pas de promesse, tu as un await à l'intérieur : "let response = await fetch(imageUrl);"
                if(isAvailable)
                {
                    movies.push(movie);
                    nbMoviesObtained++;
                } 
            }           
            if(json["next"])
            {
                response = await fetch(json["next"]);
            }
            else
            {
                break;
            }        
        }
        else
        {
            console.log("Error on movie request: " + response.status + " " + response.statusText);
            console.log(response.json());
            break;
        }
    }    
    return movies;
}

/** Get best movies(ordered by ImDb score and with image available)
 * @async
 * @param {number} limit - Maximum number of movies to be returned(default is 10)
 * @returns {Array} - Array of movies
 * @see isImageAvailable
 * @see Movie
 * @see {@link https://github.com/cGIfl300/OC_P6/tree/master/cloned_api_server/OCMovies-API-EN-FR APIGit} //Todo: Mauvais usage, pas de curly brackets, c'est un link, pas un paramètre de type link (qui n'existe pas)
*/
async function getBestMovies(limit = 10)
{
    let movies = [];
    let i = 0;
    let response = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"); //Todo: Utiliser const car c'est un immutable
    while(i < limit)
    {    
        if (response.ok)
        {
            let json = await response.json();
            let results = json["results"];

            for(let j = 0; j < results.length; j++)
            {
                let result = results[j]; // Todo: Utiliser const, car c'est un immutable
                const movie = new Movie(
                    result["id"],
                    result["imdb_url"], 
                    result["title"],
                    result["year"],
                    result["imdb_score"],
                    result["votes"],
                    result["image_url"],
                    result["directors"],
                    result["writers"],
                    result["actors"],
                    result["genres"]);
                let isAvailable = await isImageAvailable(movie.imageUrl); // Todo: await inutile, ta fonction ne retourne pas de promesse, tu as un await à l'intérieur : "let response = await fetch(imageUrl);"
                if(isAvailable)
                {
                    movies.push(movie);
                    i++;
                } 
            }
            
            if(json["next"])
            {
                response = await fetch(json["next"]);
            }
            else
            {
                break;
            }        
        }
        else
        {
            console.log("Error on movie request: " + response.status + " " + response.statusText);
            console.log(response.json());
            break;
        }
    }    
    return movies;
}

/** Get movie by id(with image available)
 * @async
 * @param {number} id - Movie id
 * @returns {(Movie|null)} - Movie object if movie(with image) is available, null otherwise
 * @see isImageAvailable
 * @see Movie
 * @see {@link https://github.com/cGIfl300/OC_P6/tree/master/cloned_api_server/OCMovies-API-EN-FR APIGit} //Todo: Mauvais usage, pas de curly brackets, c'est un link, pas un paramètre de type link (qui n'existe pas)
*/
async function getMovieById(id)
{
    let response = await fetch("http://localhost:8000/api/v1/titles/" + id);
    if (response.ok)
    {
        let json = await response.json();
        const movie = new Movie(
            json["id"],
            json["imdb_url"], 
            json["title"],
            json["year"],
            json["imdb_score"],
            json["votes"],
            json["image_url"],
            json["directors"],
            json["writers"],
            json["actors"],
            json["genres"]);         
        let isAvailable = await isImageAvailable(movie.imageUrl); //Todo: await inutile
        if(isAvailable)
        {
            return movie;
        }
        return null;
    }
    else
    {
        console.log("Error on movie request: " + response.status + " " + response.statusText);
        console.log(response.json());
        return null;
    }
}

export default { getMoviesByGenre, getBestMovies, getMovieById };