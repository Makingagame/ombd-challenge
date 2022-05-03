/*  ------------------------------------------------------------------------------------------ 
                                    GLOBAL DECLARATIONS
    ------------------------------------------------------------------------------------------ */
const apikey = "9f8a2da0";
const season = document.getElementById('season');
const moviesList = document.getElementById('moviesList');
const resultNo = document.getElementById('resultNo');
const movieDetails = document.getElementById('movieDetails');
const searchMovie = document.getElementById("searchMovie");
const watchlist = document.getElementById('watchlist');
const type = document.getElementsByName("type");
const card = document.getElementsByName("card");
const removeWatchlistBtn = document.getElementsByClassName('remove-watchlist-btn');
const cardWatchlistBtn = document.getElementsByClassName('watchlist-btn');
const movieKey = document.getElementsByClassName('movie-key');
const localStorageKeys = Object.keys(localStorage);
let pageNo = 1;
let moviesOnScreen = 0;
let searchResultNo = 0;
let noMovies = true;
let noEpisodes = true;
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
                                    RADIO BUTTON FUNCTION
    ------------------------------------------------------------------------------------------ */
    function radioButton(){
        
        if(type[0].checked)
        {
            //empty
            val = type[0].value;
        }

        if(type[1].checked)
        {
            val = type[1].value;
        }

        if(type[2].checked)
        {
            val = type[2].value;
        }

        //When radio button is pressed, search for movies
        //searchMovies();
    }
/*  ------------------------------------------------------------------------------------------ 
                                    SLIDER ONMOUSEUP FUNCTION
    ------------------------------------------------------------------------------------------ */
    //Search is performed after slider button is released
    function sliderClicked(){
        //searchMovies();
    };
/*  ------------------------------------------------------------------------------------------ 
                                    TEXT BOX (SEASON) FUNCTION
    ------------------------------------------------------------------------------------------ */
    //In the season text box, on focusout (user changes focus from search bar), set the season value and set type to 'Episodes'
    season.addEventListener("focusout", e => {
        seasonValue = document.getElementById('season').value;
        type[3].checked = true;
        searchMovies();
    })
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
    
    searchMovie.addEventListener('keyup', debounce(function() {
        searchMovies(); 
    }, 1000)); 
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


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
         
        //This variable is used to check if it is the first loop or not (if it is, display the movies found (10))
        do {
            //Increment page number to get all results from api
            pageNo++;

            //Run this block if the following radio buttons are selected: "Any", "Movies", "Series" 
            if (type[0].checked == true || type[1].checked == true || type[2].checked == true) {
                await searchMoviesOrSeries();
            }

            //Run this block if the following radio buttons are selected: "Any", "Episodes"" 
            if (type[0].checked == true || type[3].checked == true) {
                await searchEpisodes();
            }
            console.log(pageNo);
            console.log("No Movies = "+noMovies)
            console.log("No Episodes = "+noEpisodes)
        } while (noMovies == false || noEpisodes == false);

        //If there are no movies or episodes to display, display the below text instead
        if (searchResultNo == 0) {
            moviesList.innerHTML =
                `
                <p>No movies were found... please type something different to try again</p>
                `;
        }


        //Add the number of results to the top of the movie display bar
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

        console.log(url);
        console.log(movies);

        if (!movies) {
            noMovies = true;
            //Allow time for movies to be fully counted before displaying search result number
            await sleep(400);
        } else {
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
        }
    }

    //Search for Episodes (different for above as array structure returned from API Query is different)
    async function searchEpisodes() {
        let searchMovie = $("#searchMovie").val();

        let url = "https://www.omdbapi.com/?apikey="+apikey+"&t="+searchMovie+"&Season="+seasonValue+"&page="+pageNo;

        let episodesRes = await fetch(url);
        let episodesData = await episodesRes.json();
        let episodes = episodesData.Episodes;

        
        console.log(url);
        console.log(episodes);

        if (!episodes) {
            noEpisodes = true;
            //Allow time for movies to be fully counted before displaying search result number
            await sleep(400);
        } else {
            noEpisodes = false;
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
        }
    }

    //Display selected movie on right side of window
    async function expandDetailsFunction(i){

        let response = await fetch("https://www.omdbapi.com/?apikey="+apikey+"&i="+idArray[i]+"&tomatoes=true");
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

        /*Need to finish Ratings section in card below - ensure you only display ratings if they exist, 
        currently there is an error if no imdb rating exists*/
        movieDetails.innerHTML = 
        `
        <div>
            <div class="details-card" id=${expandMovieID}>
                <span id=${expandMovieIDkey} class="hide movie-key">${expandMovieIDkey}</span>
                <img src=${moviesDetailsData.Poster} class="details-card-poster" />

                <div class="details-card-header">
                    <h1 class="details-card-title">${moviesDetailsData.Title}</h1>
                </div>
                
                <div class="details-card-meta">
                    <span>${moviesDetailsData.Rated}</span>
                    <span class="details-card-runtime">${moviesDetailsData.Year}</span>
                    <span>${moviesDetailsData.Genre}</span>
                    <span class="details-card-runtime">${moviesDetailsData.Runtime}</span>
                    <button class="card-btn card-watchlist details-watchlist-btn" id="${watchlistBtnKey}" onclick="addToWatchlist(${expandMovieIDkey}, ${expandMovieID}, ${watchlistBtnKey}, ${removeBtnKey})"><img src="images/watchlist-icon.svg" alt="Add film to watchlist" class="card-watchlist-plus-icon" />&nbsp;Watchlist</button>
                    <button class="card-btn card-watchlist remove-watchlist-btn" id="${removeBtnKey}" onclick="removeFromWatchlist(${expandMovieIDkey}, ${removeBtnKey}, ${watchlistBtnKey}, ${removeBtnKey})"><img src="images/remove-icon.svg" alt="Remove film to watchlist" class="card-watchlist-plus-icon" />&nbsp;Remove</button>
                </div>
                <div class="details-card-actors">
                    <span>${moviesDetailsData.Actors}</span>
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
        watchlist.innerHTML += `<div class="detailsCard">${getLocalStorage}</div>`;
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