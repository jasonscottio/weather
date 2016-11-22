var $searchInput = $('#searchInput');
var $goButton = $('#goButton');
var $results = $('#results');
var $locationName = $("#locationName");
var $panelBody = $(".panel-body");

var $weatherDescription = $("#weatherDescription");
var $weatherImg = $("#weatherImg");
var $tempC = $("#tempC");
var $tempF = $("#tempF");
var $feelsC = $("#feelsC");
var $feelsF = $("#feelsF");
var $tempMin = $("#tempMin");
var $tempMax = $("#tempMax");
var $windSpeedKPH = $("#windSpeedKPH");
var $windSpeedMPH = $("#windSpeedMPH");
var $windDeg = $("#windDeg");
var $windDir = $("#windDir");
var $humidity = $("#humidity");
var $cloud = $("#cloud");


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
                console.log(data.current.condition);
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
    var weather = "https://api.apixu.com/v1/current.json?key=94999ca7d68e4e5a89a195033162111&q=" + query;
    //sends request
    $loading.css("display", "block");
    $.ajax({
        dataType: "json",
        url: weather,
        success: callback
    });
}


//handles search request from search button
$goButton.click(function (e) {
    e.preventDefault();
    getSearchWeather(function (data) {
        $loading.css("display", "none");
        printPanel(data);
    }, $searchInput.val());
});


function printPanel(data) {
    console.log(data);
    var location = data.location;
    var current = data.current;
    var condition = current.condition;
    $locationName.text(location.name + ", " + location.region + ", " + location.country);
    $weatherDescription.text(condition.text);
    $weatherImg.attr('src', "https:" + condition.icon);
    $tempC.text(current.temp_c); 
    $tempF.text(current.temp_f); 
    $feelsC.text(current.feelslike_c);
    $feelsF.text(current.feelslike_f);
    $windSpeedKPH.text(current.wind_kph);
    $windSpeedMPH.text(current.wind_mph);
    $windDeg.text(current.wind_degree);
    $windDir.text(current.wind_dir);
    $humidity.text(current.humidity);

}


var $searchInput = $('#searchInput');
var $goButton = $('#goButton');

$searchInput.keyup(function () {
    var value="";
    var out ="";
    var arr =[];
    value = $searchInput.val();

    $.ajax({
        url: "https://api.apixu.com/v1/search.json?key=94999ca7d68e4e5a89a195033162111&q=" + value,
        dataType: "json",
        crossDomain: true,
        success: function (parsed_json) {
            var c = $.each(parsed_json, function (i, item) {
                out = (parsed_json[i].name);
                arr.push(out);
            });
            $("#searchInput").autocomplete({
                source: arr
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
});

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
