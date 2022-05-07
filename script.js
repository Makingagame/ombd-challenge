/*  ------------------------------------------------------------------------------------------ 
                                    GLOBAL DECLARATIONS
    ------------------------------------------------------------------------------------------ */
const apikey = "9f8a2da0";
const season = document.getElementById('season');
const moviesList = document.getElementById('moviesList');
const resultNo = document.getElementById('resultNo');
const movieDetails = document.getElementById('movieDetails');
const searchMovie = document.getElementById("searchMovie");
const radioButtonAny = document.getElementById("radioButtonAny");
const radioButtonMovies = document.getElementById("radioButtonMovies");
const radioButtonSeries = document.getElementById("radioButtonSeries");
const radioButtonEpisodes = document.getElementById("radioButtonEpisodes");
const slider1 = document.getElementById("slider-1");
const slider2 = document.getElementById("slider-2");
const watchlist = document.getElementById('watchlist');
const type = document.getElementsByName("type");
const card = document.getElementsByName("card");
const removeWatchlistBtn = document.getElementsByClassName('remove-watchlist-btn');
const cardWatchlistBtn = document.getElementsByClassName('watchlist-btn');
const movieKey = document.getElementsByClassName('movie-key');
const localStorageKeys = Object.keys(localStorage);
let pageNo = 0;
let moviesOnScreen = 0;
let searchResultNo = 0;
let noMovies = true;
let errorMessage = "";
let val = "";
let idArray = [];
let i = 0;

//Only display the below code if the page is index.html (do not display on watchlist.html)
/*  ------------------------------------------------------------------------------------------ 
                                        INDEX.HTML
    ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
if(!watchlist){
    val = type[1].value;
    let seasonValue = document.getElementById('season').value;

    //Debounce function taken from: https://www.geeksforgeeks.org/debouncing-in-javascript/
    const debounce = (func, delay) => {
        let debounceTimer
        return function() {
            const context = this;
            const args = arguments;
                clearTimeout(debounceTimer)
                    debounceTimer
                = setTimeout(() => func.apply(context, args), delay)   
        }
    }

    //Sleep function        
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*  ------------------------------------------------------------------------------------------ 
                                    SLIDER FUNCTION
    ------------------------------------------------------------------------------------------ */
    window.onload = function(){
        slideOne();
        slideTwo();
    }

    let sliderOne = document.getElementById("slider-1");
    let sliderTwo = document.getElementById("slider-2");
    let displayValOne = document.getElementById("range1");
    let displayValTwo = document.getElementById("range2");
    let minGap = 0;
    let sliderTrack = document.querySelector(".slider-track");
    let sliderMinValue = document.getElementById("slider-1").min;
    let sliderMaxValue = document.getElementById("slider-1").max;
    let sliderRange = sliderMaxValue - sliderMinValue;
    //Set first slider's value
    function slideOne(){
        if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
            sliderOne.value = parseInt(sliderTwo.value) - minGap;
        }
        displayValOne.textContent = sliderOne.value;
        fillColour();
    }
    //Set second slider's value
    function slideTwo(){
        if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
            sliderTwo.value = parseInt(sliderOne.value) + minGap;
        }
        displayValTwo.textContent = sliderTwo.value;
        fillColour();
    }
    //Fill in the colour between both sliders
    function fillColour(){
        percent1 = (sliderOne.value-sliderMinValue) / sliderRange * 100;
        percent2 = (sliderTwo.value-sliderMinValue) / sliderRange * 100;
        sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , grey ${percent1}% , grey ${percent2}%, #dadae5 ${percent2}%)`;
    }

/*  ------------------------------------------------------------------------------------------ 
                                    RADIO BUTTON FUNCTIONS
    ------------------------------------------------------------------------------------------ */

    radioButtonAny.addEventListener('click', debounce(function() {
        console.log("ANY");
        //Empty
        val = type[0].value;
        searchMovies(); 
    }, 1000)); 

    radioButtonMovies.addEventListener('click', debounce(function() {
        console.log("MOVIES");
        val = type[1].value;
        searchMovies(); 
    }, 1000)); 

    radioButtonSeries.addEventListener('click', debounce(function() {
        console.log("SERIES");
        val = type[2].value;
        searchMovies(); 
    }, 1000)); 

    radioButtonEpisodes.addEventListener('click', debounce(function() {
        console.log("EPISODES");
        //val not needed for episodes
        searchMovies(); 
    }, 1000)); 

/*  ------------------------------------------------------------------------------------------ 
                                    SLIDER ONMOUSEUP FUNCTION
    ------------------------------------------------------------------------------------------ */
    //Search is performed after either slider button is released
    slider1.addEventListener("click", debounce(function() {
        console.log("YEAR1");
        seasonValue = document.getElementById('season').value;
        type[3].checked = true;
        searchMovies(); 
    }, 1000)); 

    slider2.addEventListener("click", debounce(function() {
        console.log("YEAR2");
        searchMovies(); 
    }, 1000)); 
/*  ------------------------------------------------------------------------------------------ 
                                    TEXT BOX (SEASON) FUNCTION
    ------------------------------------------------------------------------------------------ */
    /*In the season text box, if the value changes (up and down arrows) or keyup (button released): 
    set the season value, set type to 'Episodes' and search for movies */
    season.addEventListener("change", debounce(function() {
        console.log("SEASON/EPISODES");
        seasonValue = document.getElementById('season').value;
        type[3].checked = true;
        searchMovies(); 
    }, 1000)); 

    season.addEventListener("keyup", debounce(function() {
        console.log("SEASON/EPISODES");
        seasonValue = document.getElementById('season').value;
        type[3].checked = true;
        searchMovies(); 
    }, 1000)); 
/*  ------------------------------------------------------------------------------------------ 
                                    EXPAND DETAILS FUNCTION
    ------------------------------------------------------------------------------------------ */
    //Cannot call main function from onclick of Movie Title, so this function is called instead
    function expandDetails(i){
        expandDetailsFunction(i);
    }
/*  ------------------------------------------------------------------------------------------ 
                                        SEARCH FUNCTION
    ------------------------------------------------------------------------------------------ */
    
    searchMovie.addEventListener('keyup', debounce(function() {
        searchMovies(); 
    }, 1000)); 

    async function searchMovies(){

        pageNo = 0;
        searchResultNo = 0;
        moviesOnScreen = 0;

        //Hide default elements
        if (moviesList.children) {
            let children = moviesList.children;
            let childrenArr = Array.prototype.slice.call(children);
            childrenArr.forEach((child) => child.remove());
            //Empty array used for storing id's of every currently displayed movie
            idArray.splice(0, idArray.length);
            i = 0;
        }
         
        //Add a "Searching" message while the searchMovies function is running
        resultNo.innerHTML =
        `
            <span>SEARCHING ALL MOVIES... PLEASE WAIT</span>
        `;

        //Run this block if the following radio buttons are selected: "Any", "Episodes"" 
        if (type[0].checked == true || type[3].checked == true) {
            await searchEpisodes();
        }
        
        //Run this block if the following radio buttons are selected: "Any", "Movies", "Series" 
        if (type[0].checked == true || type[1].checked == true || type[2].checked == true) {
            do {
                //Increment page number to get all results from api
                pageNo++;
                await searchMoviesOrSeries();
                console.log(pageNo);
            } while (noMovies == false);
        }

        //If there are no movies or episodes to display, display the below text
        if (searchResultNo == 0 && errorMessage == "Movie not found!") {
            resultNo.innerHTML =
                `
                    <span>No results, please type something different to try again</span>
                `;
            return;
        }
        //If there are too many movies or episodes to query, display the below text
        if (searchResultNo == 0 && errorMessage == "Too many results.") {
            resultNo.innerHTML =
                `
                    <span>Too many results, please type something more specific to try again</span>
                `;
            return;
        }            
        //If the search bar is empty, display the below text
        if (searchResultNo == 0 && errorMessage == "EMPTY") {
            resultNo.innerHTML =
                `
                    <span>Search bar is empty, please type something above to try again</span>
                `;
            return;
        }    
        //If there are search results, add the number of results to the top of the movie display bar
        resultNo.innerHTML =
        `
            <span>${searchResultNo} RESULTS</span>
        `;

    }

    //Search for Movies, Series or any kind of film other than episodes from a series 
    async function searchMoviesOrSeries() {
        let searchMovie = $("#searchMovie").val();

        let url = "https://www.omdbapi.com/?apikey="+apikey+"&s="+searchMovie+"&type="+val+"&page="+pageNo;

        let moviesRes = await fetch(url);   
        let moviesData = await moviesRes.json();
        let movies = moviesData.Search;
        errorMessage = moviesData.Error;

        if (!searchMovie) {
            errorMessage = "EMPTY";
            return;           
        }

        if (!movies) {
            noMovies = true;
            //Allow time for movies to be fully counted before displaying search result number
            await sleep(400);
            return;
        }
        noMovies = false;

        //Get and display search results
        movies.forEach(async (movie) => {

            url = "https://www.omdbapi.com/?apikey="+apikey+"&i="+movie.imdbID;
            let response = await fetch(url);
            let moviesListData = await response.json();

            const movieID = moviesListData.imdbID;
            i++;
            idArray[i]= movieID;
            const movieIDkey = moviesListData.imdbID + 'key';
            
            //If all criteria is met, add to Result Counter (searchResultNo)
            if((moviesListData.Year >= sliderOne.value) && moviesListData.Year <= sliderTwo.value){
                searchResultNo++;
                //If less than 10 movies are on screen, add another movie
                if (moviesOnScreen < 10) {
                    moviesOnScreen++;
                    moviesList.innerHTML +=
                    `
                    <li name="card">
                        <div onclick="expandDetails(${i})" href="#" class="card" id=${movieID}>
                            <span id=${movieIDkey} class="hide movie-key">${movieIDkey}</span>
                            <img src=${moviesListData.Poster} class="card-poster" />
                            
                            <div class="card-header">
                                <a>
                                    <h2 class="card-title">${moviesListData.Title}</h2>
                                </a>
                            </div>
                            
                            <div class="card-meta">
                                <span class="card-year">${moviesListData.Year}</span>
                            </div>
                        </div>
                    </li>
                    `;
                }
            }
        })
        //Allow time for movies to be fully counted before displaying search result number
        await sleep(600);  
    }

    //Search for Episodes (different for above as array structure returned from API Query is different)
    async function searchEpisodes() {
        let searchMovie = $("#searchMovie").val();
        
        if (!searchMovie) {
            errorMessage = "EMPTY";
            return;           
        }

        let url = "https://www.omdbapi.com/?apikey="+apikey+"&t="+searchMovie+"&Season="+seasonValue;

        let episodesRes = await fetch(url);
        let episodesData = await episodesRes.json();
        episodes = episodesData.Episodes;

        //If there are no episodes found, return the function now
        if (!episodes) {
            //Allow time for episodes to be fully counted before displaying search result number
            await sleep(400);
            return;
        }

        //Unlike searchMoviesOrSeries function, searchEpisodes will only run once per search, so we can add results all at once
        searchResultNo+=episodes.length;

        //Get and display search results
        episodes.forEach(async (movie) => {

            url = "https://www.omdbapi.com/?apikey="+apikey+"&i="+movie.imdbID;
            let response = await fetch(url);
            let moviesListData = await response.json();

            const movieID = moviesListData.imdbID;
            i++;
            idArray[i]= movieID;
            const movieIDkey = moviesListData.imdbID + 'key';

            //If all criteria is met, add to Result Counter (searchResultNo)
            if((moviesListData.Year >= sliderOne.value) && moviesListData.Year <= sliderTwo.value){
                //If less than 10 movies are on screen, add another movie
                    if (moviesOnScreen < 10) {
                    moviesOnScreen++;
                    moviesList.innerHTML +=
                    `
                    <li name="card">
                        <div onclick="expandDetails(${i})" href="#" class="card" id=${movieID}>
                            <span id=${movieIDkey} class="hide movie-key">${movieIDkey}</span>
                            <img src=${moviesListData.Poster} class="card-poster" />

                            <div class="card-header">
                                <a onclick="expandDetails(${i})" href="#">
                                    <h2 class="card-title">${moviesListData.Title}</h2>
                                </a>
                            </div>
                            
                            <div class="card-meta">
                                <span class="card-year">${moviesListData.Year}</span>
                            </div>
                        </div>
                    </li>
                    `;
                }
            }
        })            
        //Allow time for episodes to be fully counted before displaying search result number
        await sleep(600);
    }
    
    

    //Display selected movie on right side of window
    async function expandDetailsFunction(i){

        let url = "https://www.omdbapi.com/?apikey="+apikey+"&i="+idArray[i];
        let response = await fetch("https://www.omdbapi.com/?apikey="+apikey+"&i="+idArray[i]);
        let moviesDetailsData = await response.json();

        const completePlot = moviesDetailsData.Plot;
        const expandMovieID = moviesDetailsData.imdbID + 'expand';
        const expandMovieIDkey = moviesDetailsData.imdbID + 'expandKey';
        const watchlistBtnKey = moviesDetailsData.imdbID + 'watchlistBtn';
        const removeBtnKey = moviesDetailsData.imdbID + 'removeBtn';
        let imdbRatingDenominator = "/10";
        let metascoreRatingDenominator = "/100";

        if (moviesDetailsData.imdbRating == "N/A") {
            imdbRatingDenominator = "";
        }
        if (moviesDetailsData.Metascore == "N/A") {
            metascoreRatingDenominator = "";
        }
/*
                    <button class="card-btn card-watchlist details-watchlist-btn" id="${watchlistBtnKey}" onclick="addToWatchlist(${expandMovieIDkey}, ${expandMovieID}, ${watchlistBtnKey}, ${removeBtnKey})"><img src="images/watchlist-icon.svg" alt="Add film to watchlist" class="card-watchlist-plus-icon" />&nbsp;Watchlist</button>
                    <button class="card-btn card-watchlist remove-watchlist-btn" id="${removeBtnKey}" onclick="removeFromWatchlist(${expandMovieIDkey}, ${removeBtnKey}, ${watchlistBtnKey}, ${removeBtnKey})"><img src="images/remove-icon.svg" alt="Remove film to watchlist" class="card-watchlist-plus-icon" />&nbsp;Remove</button>
*/


        /*Need to finish Ratings section in card below - ensure you only display ratings if they exist, 
        currently there is an error if no imdb rating exists*/
        movieDetails.innerHTML = 
        `
        <div>
            <div class="details-card" id=${expandMovieID}>
                <span id=${expandMovieIDkey} class="hide movie-key">${expandMovieIDkey}</span>
                <img src=${moviesDetailsData.Poster} class="details-card-poster" />

                <div class="details-card-header">
                    <h1 class="details-card-title"><br><br>${moviesDetailsData.Title}<br></h1>
                </div>
                
                <div class="details-card-meta">
                    <span>
                    <span class="rating-border">${moviesDetailsData.Rated}</span>
                    ${moviesDetailsData.Year} &middot;
                    ${moviesDetailsData.Genre} &middot;
                    ${moviesDetailsData.Runtime}
                    </span>
                </div>
                <div class="details-card-actors">
                    <span><br>${moviesDetailsData.Actors}</span>
                </div>
            </div>
            <div class="details-card-plot">
                <p>${completePlot}</p>
            </div>
            <div class="ratings">
                <div class="ratings-column">
                    <p>${moviesDetailsData.imdbRating}${imdbRatingDenominator}</p>
                    <p class="ratings-name">Internet Movies Database</p>
                </div>
                <div class="ratings-column">
                    <p>${moviesDetailsData.Metascore}${metascoreRatingDenominator}</p>
                    <p class="ratings-name">Metacritic</p>
                </div>
            </div>
        </div>
    `;
        displayWatchlistOrRemoveBtn();
    }
}
/*  ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ 
                                        INDEX.HTML
    ------------------------------------------------------------------------------------------ */


/*  ------------------------------------------------------------------------------------------ 
                        WATCHLIST.HTML (Some of it is used in index.html)
    ------------------------------------------------------------------------------------------ */

function displayWatchlistOrRemoveBtn() {
    
    for (let movie of movieKey) {
        const removeBtnID = movie.id.slice(0, 9) + 'removeBtn';
        const removeBtn = document.getElementById(removeBtnID);

        const watchlistBtnID = movie.id.slice(0, 9) + 'watchlistBtn';
        const watchlistBtn = document.getElementById(watchlistBtnID);

        localStorageKeys.forEach((key) => {
            if (movie.id === key) {
                removeBtn.style.display = 'inline';
                watchlistBtn.style.display = 'none';
            }
        })
    }
}

function addToWatchlist(expandMovieIDkey, expandMovieID, watchlistBtnKey, removeBtnKey) {
    localStorage.setItem(expandMovieIDkey.innerHTML, expandMovieID.innerHTML);
    watchlistBtnKey.style.display = 'none';
    removeBtnKey.style.display = 'inline';
}

function removeFromWatchlist(expandMovieIDkey, removeBtnKey, watchlistBtnKey, removeBtnKey) {

    localStorage.removeItem(expandMovieIDkey.innerHTML);
    //Get parent element (the movie card div) and remove it
    if (watchlist) {
        localStorage.removeItem(expandMovieIDkey.innerHTML);

        const parentEl = document.getElementById(expandMovieIDkey.innerHTML).parentElement;
        parentEl.remove();
    }

    watchlistBtnKey.style.display = 'inline';
    removeBtnKey.style.display = 'none';

    //Display default elements if local storage empty
    if (watchlist && localStorage.length === 0) {
        if (watchlist.children) {
            const children = watchlist.children;
            const childrenArr = Array.prototype.slice.call(children);
            childrenArr.forEach((child) => (child.style.display = 'flex'));
        }
    }
}

//Hide default elements if data is in local storage
if (watchlist && localStorage.length > 0) {
    if (watchlist.children) {
        const children = watchlist.children;
        const childrenArr = Array.prototype.slice.call(children);
        childrenArr.forEach((child) => (child.style.display = 'none'));
    }
}

for (let x = 0; x < localStorage.length; x++) {
    const getLocalStorage = localStorage.getItem(localStorage.key(x));

    //Display every key's value to the watchlist
    if (watchlist) {
        watchlist.innerHTML += `<div class="details-card">${getLocalStorage}</div>`;
        displayWatchlistOrRemoveBtn();
        //Hide the 'add to watchlist' button
        for (let button of cardWatchlistBtn) {
            button.style.display = 'none';
        }

        //Display the 'remove from watchlist' button
        for (let button of removeWatchlistBtn) {
            button.style.display = 'inline';
        }
    }
}