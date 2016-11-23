// finds all of the jQuery body elements
var $searchInput = $('#searchInput');
var $goButton = $('#goButton');
var $results = $('#results');
var $locationName = $("#locationName");
var $panelBody = $(".panel-body");

//todo red reformat loading screen
var $loading = $("#loading");


//initializes all the jQuery weather variables. I do it here so the browser does not have to relocate with every search
var $weatherDescription = $("#weatherDescription");
var $weatherImg = $("#weatherImg");
var $temp = $("#temp");
var $feels = $("#feels");
var $tempMin = $("#tempMin");
var $tempMax = $("#tempMax");
var $windSpeed = $("#windSpeed");
var $windDeg = $("#windDeg");
var $windDir = $("#windDir");
var $humidity = $("#humidity");
var $cloud = $("#cloud");


var storedData;
var metric = true;


//sets up toggle buttons for units
$('#radioBtn a').on('click', function () {
    var sel = $(this).data('title');
    var tog = $(this).data('toggle');
    $('#' + tog).prop('value', sel);

    $('a[data-toggle="' + tog + '"]').not('[data-title="' + sel + '"]').removeClass('active').addClass('notActive');
    $('a[data-toggle="' + tog + '"][data-title="' + sel + '"]').removeClass('notActive').addClass('active');
    updateUnits();
});


function updateUnits() {
    metric = !metric;
    if (metric) {
        $temp.text(storedData.current.temp_c);
        $feels.text(storedData.current.feelslike_c);
        $windSpeed.text(storedData.current.wind_kph);
    } else {
        $temp.text(storedData.current.temp_f);
        $feels.text(storedData.current.feelslike_f);
        $windSpeed.text(storedData.current.wind_mph);
    }
}

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
                storedData = data;
                console.log(storedData);
                printPanel();
            }, position.coords.latitude, position.coords.longitude);
        });
    } else { //TODO: red handle default behavior
        //handle no geo data
        alert("NO GEO");
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

function printPanel() {
    var location = storedData.location;
    var current = storedData.current;
    var condition = current.condition;
    $locationName.text(location.name + ", " + location.region + ", " + location.country);
    $weatherDescription.text(condition.text);
    $weatherImg.attr('src', "https:" + condition.icon);
    $windDeg.text(current.wind_degree);
    $windDir.text(current.wind_dir);
    $humidity.text(current.humidity);

    if (metric) {
        $temp.text(current.temp_c);
        $feels.text(current.feelslike_c);
        $windSpeed.text(current.wind_kph);
    } else {
        $temp.text(current.temp_f);
        $feels.text(current.feelslike_f);
        $windSpeed.text(current.wind_mph);
    }
}

// $searchInput.keyup(function () {
//     //clears variables with each keyup to prevent duplicates and errors
//     var value = "";
//     var out = "";
//     var arr = [];
//     value = $searchInput.val();

//     $.ajax({
//         url: "https://api.apixu.com/v1/search.json?key=94999ca7d68e4e5a89a195033162111&q=" + value,
//         dataType: "json",
//         crossDomain: true,
//         success: function (parsed_json) {
//             var c = $.each(parsed_json, function (i, item) {
//                 out = (parsed_json[i].name);
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