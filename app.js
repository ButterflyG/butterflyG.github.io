//creating an empty object to hol functionality of our app
var app = {};


//create an init method that will hold all the code that must run upon initialization of app 
app.init = function() {

    $('#search-button').on('click', function() { //when search button is clicked it displays search results
        $('#shows').empty();
        var showName = $('#search-box').val();
        app.getShows(showName);
    });
};

app.setShowClickListeners = function() { 
    $('.show-link').on('click', function() {
        $('#shows').empty();  //clears previuos searches
        var showId = $(this).attr('id');
        app.getShowData(showId); //ajax request to get the information of the show clicked
    });
}
app.getShowGif = function(showName) {
    console.log("gif");
    $.ajax({
        url: 'https://api.giphy.com/v1/gifs/search', // retrieves the gif
        method: 'GET',
        data: {
            q: showName,
            api_key: 'dc6zaTOxFJmzC'
        },
        success: function(result) { //make sure there is at least one gif
            console.log("gif");
            if (result.data.length > 0) {
                var image = $('<img/>').attr('src', result.data[0].images.original.url);
                var text = $('<div>').text("Gif: ");
                $('#shows').append(text).append(image);
            }
        }
    });

}

//get show method will make the Ajax request to the API
app.getShows = function(showName) {
    $.ajax({
        url: 'https://api.tvmaze.com/search/shows',
        method: 'GET',
        data: {
            q: showName
        },
        success: function(result) {

            app.displayShows(result); //display the results of the query search
        },
        error: function(error) {
            console.log('Something went wrong.');
        }
    });
};
app.getShowData = function(showId) {
    $.ajax({ //get the data of a show based on imdb id
        url: 'https://api.tvmaze.com/lookup/shows',
        method: 'GET',
        data: {
            imdb: showId
        },
        success: function(result) {
            app.dislayShowData(result);
        },
        error: function(error) {
            var errorMessage = $('<div>').html('IMDB entry not found');
            $('#shows').append(errorMessage);
        }

    });
};

// displayShow will inject show titles into the DOM
app.displayShows = function(showObjectsArray) {
    showObjectsArray.forEach(function(show) {
        console.log(show);
        //jquery for Each to loop over our array of shows
        var title = $('<a>').addClass('show-link').attr('id', show.show.externals.imdb).attr('href', '#').text(show.show.name);
        var showHtml = $('<div>').addClass('showTitles').append(title); //adding all of our elements into this div
        $('#shows').append(showHtml);
    });
    app.setShowClickListeners(); // set listeners for each show
};
app.dislayShowData = function(show) { //displayShowData will inject show data into the DOM
    var title = $('<h2>').text(show.name);
    var summary = $('<div>').html(show.summary);
    var image = $('<img/>').attr('src', show.image.medium);
    var genres = $('<div>').html('genre:  ' + show.genres.join(", "));
    var rating = $('<div>').html('rating: ' + show.rating.average);
    $('#shows').append(title).append(summary).append(image).append(genres).append(rating); // adds the div, the images to the page
    app.getShowGif(show.name); //adds the gif to the page
};


$(function() { //shortform of document ready which waits for all of the html document to be loaded before running JS
    app.init();
});


