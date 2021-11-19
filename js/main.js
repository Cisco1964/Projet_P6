let positions = {
    all_categories: 1,
    action: 1,
    animation: 1,
    biography: 1,
    adventure: 1
}

// Chargement des URL
const Best_movie = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1&page=1";
const Best_all_categories = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7&page=1";
const Best_action = "http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score&page_size=7&page=1";
const Best_animation = "http://localhost:8000/api/v1/titles/?genre=Animation&sort_by=-imdb_score&page_size=7&page=1";
const Best_biography = "http://localhost:8000/api/v1/titles/?genre=Biography&sort_by=-imdb_score&page_size=7&page=1";

// Nombre de films a afficher sur la page
const affichage = 4;

const Request = async function (url) {

    // Return the data from a request to an url 
    try {
        const response = await fetch(url);
        const jsonResponse = await response.json();
        const results = jsonResponse.results;
        return results;
    }
    catch (e) {
        logError(e);
    }
}
const LoadData = async function (urlList) {

    // A partir des URL chargement des données
    let data = [];
    for (let i = 0; i < urlList.length; i++) {
        data.push(await Request(urlList[i]));
    }
    return data
}
let BestMovieData = function (data_movie) {
    // Chargement des données pour le meilleur film
    // Poster
    document.getElementById("best").style.backgroundImage = "url('" + data_movie.image_url + "')";
    // Titre du film
    const h2 = document.querySelectorAll("#best h2");
    h2[0].innerHTML = data_movie.title;
    // Récupération de l'id du film
    aside_hidden = document.querySelector("#best aside.hidden");
    aside_hidden.innerHTML = data_movie.url;
    aside_hidden.style.display = "none";
    // Titre du film et description
    const block = document.querySelector(".best-movie_description");
    block.innerHTML = (
        "<strong>Titre :</strong> " + data_movie.title
        + "<br><strong>Description :</strong> " + data_movie.long_description)
}
const Display_Posters = function (movieGenres, movieData) {
    // Affichage des affiches des films
    const articles = movieGenres.querySelectorAll("article");
    const aside_hidden = movieGenres.querySelectorAll("aside.hidden");

    for (let i = 0; i < articles.length; i++) {
        articles[i].style.backgroundImage = "url('" + movieData[i].image_url + "')";
        aside_hidden[i].innerHTML = movieData[i].url;
        aside_hidden[i].style.display = "none";
    }
}
let Display_Data = function (movie, data_movie) {
    // Gestion de la modal, chargement des données 
    const blocks = document.querySelector("#" + movie + " .modal");
    blocks.querySelector("p").innerHTML = (
        "<strong>" + data_movie.title + "</strong>"
        + "<br>'<img src=" + data_movie.image_url + '" width=\"100\" height=\"150\"/>' 
        + "<br><strong>Genre(s) :</strong> " + data_movie.genres
        + "<br><strong>Date de sortie :</strong> " + data_movie.date_published
        + "<br><strong>Note :</strong> " + data_movie.imdb_score
        + "<br><strong>Rated :</strong> " + data_movie.rated
        + "<br><strong>Producteur :</strong> " + data_movie.directors
        + "<br><strong>Acteurs :</strong> " + data_movie.actors
        + "<br><strong>Durée (mn):</strong> " + data_movie.duration
        + "<br><strong>Pays :</strong> " + data_movie.countries
        + "<br><strong>Description :</strong> " + data_movie.long_description

    );
    debugger;
}
let LoadPage = async function () {

    // Initialisation de la page en focntion des catégories
    data = await LoadData([Best_movie, Best_all_categories, Best_action, Best_animation, Best_biography]);
    const bestmovie = data[0];
    const categoryBlocks = document.querySelectorAll(".category");
    //Categories
    for (let i = 0; i < categoryBlocks.length; i++) {
        Display_Posters(categoryBlocks[i], data[(i + 1)]);
    }
    // Best Movie
    response = await fetch(bestmovie[0].url);
    data_movie = await response.json();
    BestMovieData(data_movie);
}
let checkArrows = async function (category, somme_element) {
    // Change the side arrows (to browse the movies) to active or to disable according to the position inside the categories
    if (positions[category] == 1) {
        document.querySelector("#" + category + " .left").classList.add("side-arrow--disable");
    } else if (positions[category] > (somme_element - affichage)) {
        document.querySelector("#" + category + " .right").classList.add("side-arrow--disable");
    } else {
        document.querySelector("#" + category + " .left").classList.remove("side-arrow--disable");
        document.querySelector("#" + category + " .right").classList.remove("side-arrow--disable");
    }
}
let setVisibleMovies = async function (parent, position) {
    // Display or hide the movies in the categories depending of the position of the category
    const somme_element = 7;
    for (let i = 1; i <= somme_element; i++) {
        if ((i >= position) && (i < (affichage + position))) {
            document.querySelector(parent + " .category__best-movies .movie:nth-child(" + i + ")").classList.remove("movie--hidden");
        } else {
            document.querySelector(parent + " .category__best-movies .movie:nth-child(" + i + ")").classList.add("movie--hidden");
        }
    }
}
let changeCategoryPosition = async function (category, direction) {

    // Modification de la position dans la catégorie
    const somme_element = document.querySelectorAll("#" + category + " .movie").length;
    if (direction == "right") {
        if (positions[category] <= (somme_element - affichage)) {
            positions[category]++;
            setVisibleMovies("#" + category, positions[category]);
        }
    } else {
        if (positions[category] > 1) {
            positions[category]--;
            setVisibleMovies("#" + category, positions[category]);
        }
    }
    checkArrows(category, somme_element);
}
// Ouverture de la modal
let openModal = async function (movie) {

    // Récuperation du détail des films
    aside_hidden = document.querySelector("#" + movie + " .hidden");
    const response = await fetch(aside_hidden.innerHTML);
    const data_movie = await response.json();
    Display_Data(movie, data_movie);
    document.querySelector("#" + movie + " .modal").style.visibility = "visible";
}
// Fermeture de la modal
let closeModal = async function (movie) {
    document.querySelector("#" + movie + " .modal").style.visibility = "hidden";
}
// Chargement des données
LoadPage();
