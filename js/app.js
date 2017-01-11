// finds all of the jQuery body elements
var $searchInput = $('#searchInput');
var $goButton = $('#goButton');
var $posButton = $('#posButton');
var $locationName = $("#locationName");
var $loading = $('#loading');

//initializes all the jQuery weather variables. 
//I do it here so the browser does not have to relocate 
//with every search - would be performance hit
var $currentDescription = $("#currentDescription");
var $currentImg = $("#currentImg");
var windSpeed = document.getElementById("windSpeed");
var $windDir = $("#windDir");
var $humidity = $("#humidity");
var $cloud = $("#cloud");


// vanilla DOM selectors
var currentTemp = document.getElementById("currentTemp");
var feels = document.getElementById("currentFeels");

// variables for handling unit toggling
var storedForecast;
var units = "metric";


var $dates = $(".date");
var $forecastImgs = $(".forecastImg");
var $highs = $(".forecastHigh");
var $lows = $(".forecastLow");

// intial forecast for gothenburg
getWeather("Gothenburg");

//sets up toggle buttons for units
$('#radioBtn a').on('click', function () {
    var sel = $(this).data('title');
    //assigns the stored units as the clicked one
    units = sel;
    var tog = $(this).data('toggle');

    //toggles styling between active and not
    $('a[data-toggle="' + tog + '"]').not('[data-title="' + sel + '"]').removeClass('active').addClass('notActive');
    $('a[data-toggle="' + tog + '"][data-title="' + sel + '"]').removeClass('notActive').addClass('active');
    updateUnits();
});

//sets up pos button to get geo weather
$posButton.click(function (e) {
    e.preventDefault();
    getLocation();
});

// search button 
$goButton.click(function (e) {
    e.preventDefault();
    if ($searchInput.val() !== "") {
        getWeather($searchInput.val());
    } else {
        alert("Input a Search Value!");
    }
});

function getLocation() {
    //checks to see if there is valid geo data
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // sends position to callback to find weather
            var coords = position.coords.latitude + "," + position.coords.longitude;
            getWeather(coords);
        });
    } else {
        //handle no geo data
        alert("Your Browser Does Not Support Geographical Information");
    }
}

//updates unit format
function updateUnits() {
    if (units == "metric") {
        currentTemp.innerHTML = storedForecast.current.temp_c + "&deg";
        feels.innerHTML = storedForecast.current.feelslike_c + "&deg";
        windSpeed.innerHTML = storedForecast.current.wind_kph + " KPH";
    } else {
        currentTemp.innerHTML = storedForecast.current.temp_f + "&deg;";
        feels.innerHTML = storedForecast.current.feelslike_f + "&deg;";
        windSpeed.innerHTML = storedForecast.current.wind_mph + " MPH";
    }
}

function getWeather(query) {
    $loading.fadeIn("fast");
    //sets currentUrl variable with query
    var forecastUrl = "https://api.apixu.com/v1/forecast.json?key=94999ca7d68e4e5a89a195033162111&days=5&q=" + query;

    $.ajax({
        dataType: "json",
        url: forecastUrl,
        success: function (data) {
            $loading.fadeOut("fast");
            storedForecast = data;
            printPanel();
        }
    });

}

function printPanel() {

    //handles case where search returned no value
    if (storedForecast.location === undefined) {
        alert("Invalid Search");
        return null;
    }

    // sets all the values from stored return location
    $locationName.text(storedForecast.location.name + ", " + storedForecast.location.region + ", " + storedForecast.location.country);
    $currentDescription.text(storedForecast.current.condition.text);
    $currentImg.attr('src', "https:" + storedForecast.current.condition.icon);
    $windDir.removeClass();
    $windDir.addClass("wi wi-wind wi-towards-" + storedForecast.current.wind_dir.toLowerCase());
    $humidity.text(storedForecast.current.humidity);
    $cloud.text(storedForecast.current.cloud);

    $dates.each(function (i) {
        $(this).text(storedForecast.forecast.forecastday[i].date.substr(5));
    });
    $forecastImgs.each(function (i) {
        $(this).attr('src', "https:" + storedForecast.forecast.forecastday[i].day.condition.icon);
    });


    if (units == "metric") {
        currentTemp.innerHTML = storedForecast.current.temp_c + "&deg";
        feels.innerHTML = storedForecast.current.feelslike_c + "&deg";
        windSpeed.innerHTML = storedForecast.current.wind_kph + " KPH";
        $highs.each(function (i) {
            $(this).html(storedForecast.forecast.forecastday[i].day.maxtemp_c + "&deg");
        });
        $lows.each(function (i) {
            $(this).html(storedForecast.forecast.forecastday[i].day.mintemp_c + "&deg");
        });
    } else {
        currentTemp.innerHTML = storedForecast.current.temp_f + "&deg;";
        feels.innerHTML = storedForecast.current.feelslike_f + "&deg;";
        windSpeed.innerHTML = storedForecast.current.wind_mph + " MPH";
        $highs.each(function (i) {
            $(this).html(storedForecast.forecast.forecastday[i].day.maxtemp_f + "&deg");
        });
        $lows.each(function (i) {
            $(this).html(storedForecast.forecast.forecastday[i].day.mintemp_f + "&deg");
        });
    }
}


// handles auto complete
$searchInput.keyup(function () {
    //clears variables with each keyup to prevent duplicates and errors
    var value = "";
    var name = "";
    var nameList = [];
    value = $searchInput.val();

    $.ajax({
        url: "https://api.apixu.com/v1/search.json?key=94999ca7d68e4e5a89a195033162111&q=" + value,
        dataType: "json",
        crossDomain: true,
        success: function (data) {
            var c = $.each(data, function (i, item) {
                name = (data[i].name);
                nameList.push(name);
            });
            $("#searchInput").autocomplete({
                source: nameList
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
});