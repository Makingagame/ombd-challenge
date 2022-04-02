const apikey = "9f8a2da0";
const moviesList = document.getElementById('moviesList')
const searchMovie = document.getElementById("searchMovie");
let type = document.getElementsByName("type");
let val = type[1].value;










/*Slider filter function */
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
    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
}


function radioButton(){
    
    if(type[0].checked)
    {
        val = type[0].value;
        return;
    }

    if(type[1].checked)
    {
        val = type[1].value;
        return;
    }

    if(type[2].checked)
    {
        val = type[2].value;
        return;
    }    

    if(type[3].checked) {
        val = type[3].value;
        return;
    }
}

//On keyup (user releases keyboard key) run below (send an API call and retrieve results based on filter values)
searchMovie.addEventListener("keyup", e => { 
    
    $(document).ready(function(){
        let searchMovie = $("#searchMovie").val()   

        let url = "http://www.omdbapi.com/?apikey="+apikey

        $.ajax({
            method:'GET',
            url:url+"&t="+searchMovie+"&type="+val,
            success:function(data){
                
                movieTitleYear = `
                        
                <img style="float:left" class="img-thumbnail" width="200" height="200" src="${data.Poster}"/>
                <h2>${data.Title}</h2>
                <h2>${data.Year}</h2>
                `

                movieDetails = `
                        
                        <img style="float:left" class="img-thumbnail" width="200" height="200" src="${data.Poster}"/>
                        <h2>${data.Title}</h2>
                        <h2>${data.Rated}</h2>
                        <h2>${data.Year}</h2>
                        <h2>${data.Genre}</h2>
                        <h2>${data.Runtime}</h2>
                        <h2>${data.Actors}</h2>
                        `

                $("#movieTitleYear").html(movieTitleYear)
                $("#movieDetails").html(movieDetails)
                
                console.log(data)
                console.log(url+"&t="+searchMovie+"&type="+val)
        
            }
        })

    })
});
  
