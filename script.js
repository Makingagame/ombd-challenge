console.log('Hello World!');
var apikey = "9f8a2da0"

const searchMovie = document.getElementById("searchMovie");


//On keyup (user releases keyboard key) run below (send an API call and retrieve results)
searchMovie.addEventListener("keyup", e => { 
    const searchMovieString = e.target.value; 

    console.log(searchMovieString);


$(document).ready(function(){

    console.log(apikey);

        var searchMovie = $("#searchMovie").val()

        var result = ""

        var url = "http://www.omdbapi.com/?apikey="+apikey

        $.ajax({
            method:'GET',
            url:url+"&t="+searchMovie,
            success:function(data){
                console.log(data)

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
            }
        })

})
});
  
