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

async function getMoviesByGenre(genre, limit = 10)
{   
    let movies = [];
    let i = 0;
    let response = await fetch("http://localhost:8000/api/v1/titles/?genre=" + genre);    
    while(i < limit)
    {    
        if (response.ok)
        {
            let json = await response.json();
            let results = json["results"];

            results.forEach(result => {
                const movie = new Movie(
                    result["id"],
                    result["imdbUrl"], 
                    result["title"],
                    result["year"],
                    result["imdb_score"],
                    result["votes"],
                    result["image_url"],
                    result["directors"],
                    result["writers"],
                    result["actors"],
                    result["genres"]);
                movies.push(movie);
                i++;
            });
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
            alert("HTTP-Error: " + response.status);
            break;
        }
    }
    
    return movies;
}

async function getBestMovies(limit = 10)
{
    let movies = [];
    let i = 0;
    let response = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score");    
    while(i < limit)
    {    
        if (response.ok)
        {
            let json = await response.json();
            let results = json["results"];

            results.forEach(result => {
                const movie = new Movie(
                    result["id"],
                    result["imdbUrl"], 
                    result["title"],
                    result["year"],
                    result["imdb_score"],
                    result["votes"],
                    result["image_url"],
                    result["directors"],
                    result["writers"],
                    result["actors"],
                    result["genres"]);
                movies.push(movie);
                i++;
            });
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
            alert("HTTP-Error: " + response.status);
            break;
        }
    }
    
    return movies;
}

async function getMovieById(id)
{
    let response = await fetch("http://localhost:8000/api/v1/titles/" + id);
    if (response.ok)
    {
        let json = await response.json();
        const movie = new Movie(
            json["id"],
            json["imdbUrl"], 
            json["title"],
            json["year"],
            json["imdb_score"],
            json["votes"],
            json["image_url"],
            json["directors"],
            json["writers"],
            json["actors"],
            json["genres"]);
        return movie;
    }
    else
    {
        alert("HTTP-Error: " + response.status);
        return null;
    }
}

export default { getMoviesByGenre, getBestMovies, getMovieById };