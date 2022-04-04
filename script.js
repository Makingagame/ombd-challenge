/*  ------------------------------------------------------------------------------------------ 
                                    GLOBAL DECLARATIONS
    ------------------------------------------------------------------------------------------ */

const apikey = "9f8a2da0";
const moviesList = document.getElementById('moviesList')
const movieDetails = document.getElementById('movieDetails')
const searchMovie = document.getElementById("searchMovie");
const type = document.getElementsByName("type");
const card = document.getElementsByName("card")

const watchlist = document.getElementById('watchlist')
const removeWatchlistBtn = document.getElementsByClassName('remove-watchlist-btn')
const cardWatchlistBtn = document.getElementsByClassName('watchlist-btn')
const movieKey = document.getElementsByClassName('movie-key')
const localStorageKeys = Object.keys(localStorage)
let season = document.getElementById('season').value;
let val = "";

//Only display the below code if the page is index.html (do not display on watchlist.html)
/*  ------------------------------------------------------------------------------------------ 
                                        INDEX.HTML
    ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */

if(!watchlist){
    val = type[1].value;

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

    function slideOne(){
        if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
            sliderOne.value = parseInt(sliderTwo.value) - minGap;
        }
        displayValOne.textContent = sliderOne.value;
        fillColor();
    }
    function slideTwo(){
        if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
            sliderTwo.value = parseInt(sliderOne.value) + minGap;
        }
        displayValTwo.textContent = sliderTwo.value;
        fillColor();
    }
    function fillColor(){
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
        searchMovies();
    }

/*  ------------------------------------------------------------------------------------------ 
                                    SLIDER ONMOUSEUP FUNCTION
    ------------------------------------------------------------------------------------------ */
    
    //Search is performed after slider button is released, not everytime value changes
    function sliderClicked(){
        searchMovies();
    };

/*  ------------------------------------------------------------------------------------------ 
                                    TEXT BOX (SEASON) FUNCTION
    ------------------------------------------------------------------------------------------ */

    function changeSeason(){
        season = document.getElementById('season').value;
        type[3].checked = true;
        searchMovies();
    }

/*  ------------------------------------------------------------------------------------------ 
                                        SEARCH FUNCTION
    ------------------------------------------------------------------------------------------ */

    //In the search bar, on keyup (user releases a keyboard key) search for movies
    searchMovie.addEventListener("keyup", e => { 
        searchMovies();
    })


    async function searchMovies(){
        //Hide default elements
        if (moviesList.children) {
            let children = moviesList.children
            let childrenArr = Array.prototype.slice.call(children)
            childrenArr.forEach((child) => child.remove())
        }
        

        //Run this block if the following radio buttons are selected: "Any", "Movies", "Series" 
        if (type[0].checked == true || type[1].checked == true || type[2].checked == true) {
            console.log("Any, Movies, Series")
            let searchMovie = $("#searchMovie").val()   
            let url = "https://www.omdbapi.com/?apikey="+apikey+"&s="+searchMovie+"&type="+val

            let res = await fetch(url)
            let data = await res.json()

            console.log(data)

            let movies = data.Search

            // Get and display search results
            movies.forEach(async (movie) => {

                url = "https://www.omdbapi.com/?apikey="+apikey+"&i="+movie.imdbID

                let response = await fetch(url)
                let moviesListData = await response.json()


                const completePlot = moviesListData.Plot
                const movieID = moviesListData.imdbID
                const movieIDkey = moviesListData.imdbID + 'key'
                const watchlistBtnKey = moviesListData.imdbID + 'watchlistBtn'
                const removeBtnKey = moviesListData.imdbID + 'removeBtn'

                if((moviesListData.Year >= sliderOne.value) && moviesListData.Year <= sliderTwo.value){
                    moviesList.innerHTML +=
                    `
                    <li name="card" onclick="expandDetails">
                        <div class="card" id=${movieID}>
                            <span id=${movieIDkey} class="hide movie-key">${movieIDkey}</span>
                            <img src=${moviesListData.Poster} class="card-poster" />

                            <div class="card-header">
                                <a onclick="expandDetails()" href="#" >
                                    <h2 class="card-title">${moviesListData.Title}</h2>
                                </a>
                            </div>
                            
                            <div class="card-meta">
                                <span class="card-year">${moviesListData.Year}</span>
                            </div>
                        </div>
                    </li>
                    `
                }
            })
        }



        //Run this block if the following radio buttons are selected: "Any", "Episodes"" 
        if (type[0].checked == true || type[3].checked == true) {
            let searchMovie = $("#searchMovie").val()
            let url = "https://www.omdbapi.com/?apikey="+apikey+"&t="+searchMovie+"&Season="+season

            let res = await fetch(url)
            let data = await res.json()

            console.log(data)
            
            let movies = data.Episodes
            
            // Get and display search results
            movies.forEach(async (movie) => {

                url = "https://www.omdbapi.com/?apikey="+apikey+"&i="+movie.imdbID

                let response = await fetch(url)
                let moviesListData = await response.json()


                const completePlot = moviesListData.Plot
                const movieID = moviesListData.imdbID
                const movieIDkey = moviesListData.imdbID + 'key'
                const watchlistBtnKey = moviesListData.imdbID + 'watchlistBtn'
                const removeBtnKey = moviesListData.imdbID + 'removeBtn'

                if((moviesListData.Year >= sliderOne.value) && moviesListData.Year <= sliderTwo.value){
                    moviesList.innerHTML +=
                    `
                    <li name="card">
                        <div class="card" id=${movieID}>
                            <span id=${movieIDkey} class="hide movie-key">${movieIDkey}</span>
                            <img src=${moviesListData.Poster} class="card-poster" />

                            <div class="card-header">
                                <a onclick="expandDetails()" href="#">
                                    <h2 class="card-title">${moviesListData.Title}</h2>
                                </a>
                            </div>
                            
                            <div class="card-meta">
                                <span class="card-year">${moviesListData.Year}</span>
                            </div>
                        </div>
                        </span>
                    </li>
                    `
                }
            })
        }
    }


    //Search is performed after slider button is released, not everytime value changes
    function expandDetails(){
        console.log("SUCCESS"); 
        movieDetails =               
        `
        <div class="cards">
            <div class="card" id=${movieID}>
                <span id=${movieIDkey} class="hide movie-key">${movieIDkey}</span>
                <img src=${moviesListData.Poster} class="card-poster" />

                <div class="card-header">
                    <h2 class="card-title">${moviesListData.Title}</h2>
                    <img src="images/star-icon.svg" class="star-icon" />
                    <span class="card-rating">${moviesListData.imdbRating}</span>
                </div>
                
                <div class="card-meta">
                    <span class="card-runtime">${moviesListData.Runtime}</span>
                    <span>${moviesListData.Genre}</span>

                    <button class="card-btn card-watchlist watchlist-btn" id="${watchlistBtnKey}" onclick="addToWatchlist(${movieIDkey}, ${movieID}, ${watchlistBtnKey}, ${removeBtnKey})"><img src="images/watchlist-icon.svg" alt="Add film to watchlist" class="card-watchlist-plus-icon" />&nbsp;Watchlist</button>

                    <button class="card-btn card-watchlist remove-watchlist-btn" id="${removeBtnKey}" onclick="removeFromWatchlist(${movieIDkey}, ${removeBtnKey}, ${watchlistBtnKey}, ${removeBtnKey})"><img src="images/remove-icon.svg" alt="Remove film to watchlist" class="card-watchlist-plus-icon" />&nbsp;Remove</button>
                </div>
                <p class="card-plot">${completePlot}</p>
            </div>
        </div>
    `
        
        displayWatchlistOrRemoveBtn()
    };
}
/*  ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ 
                                        INDEX.HTML
    ------------------------------------------------------------------------------------------ */














/*  ------------------------------------------------------------------------------------------ 
                                WATCH LIST + LOCAL STORAGE
    ------------------------------------------------------------------------------------------ */

function displayWatchlistOrRemoveBtn() {
    for (let movie of movieKey) {
        const removeBtnID = movie.id.slice(0, 9) + 'removeBtn'
        const removeBtn = document.getElementById(removeBtnID)

        const watchlistBtnID = movie.id.slice(0, 9) + 'watchlistBtn'
        const watchlistBtn = document.getElementById(watchlistBtnID)

        localStorageKeys.forEach((key) => {
            if (movie.id === key) {
                removeBtn.style.display = 'inline'
                watchlistBtn.style.display = 'none'
            }
        })
    }
}

function addToWatchlist(movieIDkey, movieID, watchlistBtnKey, removeBtnKey) {
    localStorage.setItem(movieIDkey.innerHTML, movieID.innerHTML)
    watchlistBtnKey.style.display = 'none'
    removeBtnKey.style.display = 'inline'
}

function removeFromWatchlist(movieIDkey, removeBtnKey, watchlistBtnKey, removeBtnKey) {
    localStorage.removeItem(movieIDkey.innerHTML)

    // Get parent element (the movie card div) and remove it
    if (watchlist) {
        localStorage.removeItem(movieIDkey.innerHTML)

        const parentEl = document.getElementById(movieIDkey.innerHTML).parentElement
        parentEl.remove()
    }

    watchlistBtnKey.style.display = 'inline'
    removeBtnKey.style.display = 'none'

    // Display default elements if local storage empty
    if (watchlist && localStorage.length === 0) {
        if (watchlist.children) {
            const children = watchlist.children
            const childrenArr = Array.prototype.slice.call(children)
            childrenArr.forEach((child) => (child.style.display = 'flex'))
        }
    }
}

// Hide default elements if data is in local storage
if (watchlist && localStorage.length > 0) {
    if (watchlist.children) {
        const children = watchlist.children
        const childrenArr = Array.prototype.slice.call(children)
        childrenArr.forEach((child) => (child.style.display = 'none'))
    }
}

for (let i = 0; i < localStorage.length; i++) {
    const getLocalStorage = localStorage.getItem(localStorage.key(i))

    // Display every key's value to the watchlist
    if (watchlist) {
        watchlist.innerHTML += `<div class="card">${getLocalStorage}</div>`

        // Hide the 'add to watchlist' button
        for (let button of cardWatchlistBtn) {
            button.style.display = 'none'
        }

        // Display the 'remove from watchlist' button
        for (let button of removeWatchlistBtn) {
            button.style.display = 'inline'
        }
    }
}