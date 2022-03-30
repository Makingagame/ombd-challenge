const apikey = "9f8a2da0"
const searchMovie = document.getElementById("searchMovie");

//Year Range Slider Function
$(function() {
    $( "#slider-3" ).slider({
       range:true,
       min: 1900,
       max: 2040,
       values: [ 1970, 2015 ],
       slide: function( event, ui ) {
          $( "#year" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
       }
    });
    $( "#year" ).val( $( "#slider-3" ).slider( "values", 0 ) +
       " - " + $( "#slider-3" ).slider( "values", 1 ) );
 });


//On keyup (user releases keyboard key) run below (send an API call and retrieve results based on filters)
searchMovie.addEventListener("keyup", e => { 
    const searchMovieString = e.target.value;
    $(document).ready(function(){
        let searchMovie = $("#searchMovie").val()
        let result = ""
        let url = "http://www.omdbapi.com/?apikey="+apikey

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
  
