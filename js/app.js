var $searchInput = $('#searchInput');
var $goButton = $('#goButton');
var $results = $('#results');
var $locationName = $("#locationName");
var $panelBody = $(".panel-body");

var $weather = $("#weather");
var $weatherDescription = $("#weatherDescription");
var $temp = $("#temp");
var $tempMin = $("#tempMin");
var $tempMax = $("#tempMax");
var $windSpeed = $("#windSpeed");
var $windDeg = $("#windDeg");
var $weatherImg = $("#weatherImg");

var $loading = $("#loading");



//pulls GPS weather at page load
getLocation();


//pulls GPS data from browser
function getLocation() {
    //checks to see if there is valid geo data
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // sends position to callback to find weather
            getGeoWeather(function (data) {
                $loading.css("display", "none");
                console.log("Getting Here!");
                console.log(data.location);
                console.log(data.current);
                printPanel(data);
            }, position.coords.latitude, position.coords.longitude);
        });
    } else {
        //handle no geo data
        alert("NO GEO!");
    }
}


//gets weather based on geo data
function getGeoWeather(callback, lat, lon) {
    //sets search URL with geo data
    var weatherURL = "https://api.apixu.com/v1/current.json?key=94999ca7d68e4e5a89a195033162111&q=" + lat + "," + lon;
    //sends request
    $loading.css("display", "block");
    $.ajax({
        dataType: "json",
        url: weatherURL,
        success: callback
    });
}

//gets weather based on search
function getSearchWeather(callback, query) {
    //sets search URL with query
    var weather = 'http://api.openweathermap.org/data/2.5/find?q=' + query + '&type=accurate&appid=9b487de8cb6160f9df489c31f523eb98&units=imperial';
    //sends request
    $loading.css("display", "block");
    $.ajax({
        dataType: "jsonp",
        url: weather,
        success: callback
    });
}


//handles search request from search button
$goButton.click(function (e) {
    e.preventDefault();
    getSearchWeather(function (data) {
        $loading.css("display", "none");
        printPanel(data.list[0]);
    }, $searchInput.val());
});


function printPanel(data) {
    var location = data.location;
    var current = data.current;
    $locationName.text(location.name + ", " + location.region + ", " + location.country);
    // $weather.text(data.weather[0].main);
    // $weatherDescription.text(data.weather[0].description);
    // $temp.text(data.main.temp); 
    // $tempMin.text(data.main.temp_min);
    // $tempMax.text(data.main.temp_max);
    // $windSpeed.text(data.wind.speed);
    // $windDeg.text(data.wind.deg);
    // $weatherImg.attr('src', "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");    
}




























// jQuery(document).ready(function($) {
//   $.ajax({
//   url : "http://api.wunderground.com/api/e75bc1741a076571/geolookup/conditions/q/IA/Cedar_Rapids.json",
//   dataType : "jsonp",
//   success : function(parsed_json) {
//   var location = parsed_json['location']['city'];
//   var temp_f = parsed_json['current_observation']['temp_f'];
//   alert("Current temperature in " + location + " is: " + temp_f);
//   }
//   });
// });
// var i;
// var out;
// var arr=[];


// var $searchInput = $('#searchInput');
// var $goButton = $('#goButton');

// $searchInput.keyup(function () {
//     var value = $searchInput.val();

//     $.ajax({
//         url: "http://autocomplete.wunderground.com/aq?&cb=call=?",
//         dataType: "jsonp",
//         data: {
//             "query": value
//         },
//         crossDomain: true,
//         success: function (parsed_json) {
//             var c = $.each(parsed_json.RESULTS, function (i, item) {
//                 out = (parsed_json.RESULTS[i].name);
//                 arr.push(out);

//             });
//             $("#searchInput").autocomplete({
//                 source: arr
//             });
//         },
//         error: function (xhr, ajaxOptions, thrownError) {
//             alert(xhr.status);
//             alert(thrownError);
//         }
//     });
// });

// $goButton.on("click", function(){
//     var query = $searchInput.val();
//     console.log(query);
// });

// $(function () {
//     var availableTags = [
//         "ActionScript",
//         "AppleScript",
//         "Asp",
//         "BASIC",
//         "C",
//         "C++",
//         "Clojure",
//         "COBOL",
//         "ColdFusion",
//         "Erlang",
//         "Fortran",
//         "Groovy",
//         "Haskell",
//         "Java",
//         "JavaScript",
//         "Lisp",
//         "Perl",
//         "PHP",
//         "Python",
//         "Ruby",
//         "Scala",
//         "Scheme"
//     ];
//     $("#searchInput").autocomplete({
//         source: availableTags
//     });
// });