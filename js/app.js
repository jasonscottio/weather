/*
    Author: Jason Scott
    Website: jasonscott.io
    Email: jason@jasonscott.io

  All of these variables are init at the top of the program so that jQuery does not have to find the related DOM elements every time 
  a search is completed. This is done in order to save resources and provide a quicker experience.
*/

// INITS ALL jQUERY BODY ELEMENTS
var $searchInput = $('#searchInput');
var $goButton = $('#goButton');
var $posButton = $('#posButton');
var $locationName = $("#locationName");
var $loading = $('#loading');
var $datepicker = $("#datepicker");

// INITS CURRENT WEATHER jQUERY VARIABLES
var $currentDescription = $("#currentDescription");
var $currentImg = $("#currentImg");
var windSpeed = document.getElementById("windSpeed");
var $windDir = $("#windDir");
var $humidity = $("#humidity");
var $cloud = $("#cloud");

// VANILLA DOM SELECTORS FOR PROJECT GOALS
var currentTemp = document.getElementById("currentTemp");
var feels = document.getElementById("currentFeels");

// INITS RETURNED DATA SO IT CAN BE ACCESSED FOR UNIT TOGGLE
var storedCurrent, storedForecast, storedHistoric;
var units = "metric";
var historicPrinted = false;

// INITS FORECAST jQUERY VARIABLES
var $dates = $(".date");
var $forecastImgs = $(".forecastImg");
var $highs = $(".forecastHigh");
var $lows = $(".forecastLow");

// INITS HISTORIC jQUERY VARIABLES
var $historicDate = $("#historicDate");
var $historicImg = $("#historicImg");
var $historicHigh = $("#historicHigh");
var $historicLow = $("#historicLow");
var $historicTable = $("#historicTable");



// INITIAL FORECAST FOR GOTHENBURG
getWeather("Gothenburg");
setupButtons();


// FUNCTION TO GROUP ALL INITIAL SETUP
function setupButtons (){
    // INITS TOGGLE BUTTONS FOR UNITS
    $('#radioBtn a').on('click', function () {
        var sel = $(this).data('title');
        // ASSIGNS STORED UNITS AS CLICKED
        units = sel;
        var tog = $(this).data('toggle');
        // TOGGLES BUTTON STYLING BETWEEN ACTIVE AND NOT
        $('a[data-toggle="' + tog + '"]').not('[data-title="' + sel + '"]').removeClass('active').addClass('notActive');
        $('a[data-toggle="' + tog + '"][data-title="' + sel + '"]').removeClass('notActive').addClass('active');
        updateUnits();
    });

    // SETS UP POS BUTTON FOR GEO WEATHER
    $posButton.click(function (e) {
        e.preventDefault();
        getLocation();
    });

    // SETS UP SEARCH BUTTON
    $goButton.click(function (e) {
        e.preventDefault();
        if ($searchInput.val() !== "") {
            getWeather($searchInput.val());
        } else {
            alert("Input a Search Value!");
        }
    });

    // INITS DATE PICKER
    $( "#datepicker" ).datepicker({
        selectOtherMonths: false,
        minDate: -7,
        maxDate: 0,
        dateFormat: "yy-mm-dd",
        onSelect: function(date) {
            getHistoric(storedCurrent.location.lat, storedCurrent.location.lon, date);
        }
    });
}

//GETS BROWSER GEO INFO
function getLocation() {
    // CHECKS FOR VALID GEO DATA
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // SENDS POSITION TO GET WEATHER
            var coords = position.coords.latitude + "," + position.coords.longitude;
            getWeather(coords);
        });
    } else {
        // HANDLE NO GEO DATA
        alert("Your Browser Does Not Support Geographical Information");
    }
}

//UPDATES UNIT DATA
function updateUnits() {
    if (units == "metric") {
        //CHANGES CURRENT
        currentTemp.innerHTML = storedForecast.current.temp_c + "&deg";
        feels.innerHTML = storedForecast.current.feelslike_c + "&deg";
        windSpeed.innerHTML = storedForecast.current.wind_kph + " KPH";

        //CHANGES FORECAST
        $highs.each(function (i) {
            $(this).html(storedForecast.forecast.forecastday[i].day.maxtemp_c + "&deg");
        });
        $lows.each(function (i) {
            $(this).html(storedForecast.forecast.forecastday[i].day.mintemp_c + "&deg");
        });

        //CHANGES HISTORICAL IF HISTORICAL EXISTS
        if(historicPrinted){
            $historicHigh.html(storedHistoric.forecast.forecastday[0].day.maxtemp_c + "&deg");
            $historicLow.html(storedHistoric.forecast.forecastday[0].day.mintemp_c + "&deg");
        }

    } else {
        
        //CHANGES CURRENT
        currentTemp.innerHTML = storedForecast.current.temp_f + "&deg;";
        feels.innerHTML = storedForecast.current.feelslike_f + "&deg;";
        windSpeed.innerHTML = storedForecast.current.wind_mph + " MPH";

        //CHANGES FORECAST
        $highs.each(function (i) {
            $(this).html(storedForecast.forecast.forecastday[i].day.maxtemp_f + "&deg");
        });
        $lows.each(function (i) {
            $(this).html(storedForecast.forecast.forecastday[i].day.mintemp_f + "&deg");
        });

        // CHANGES HISTORICAL IF HISTORICAL EXISTS
        if(historicPrinted){
            $historicHigh.html(storedHistoric.forecast.forecastday[0].day.maxtemp_f + "&deg");
            $historicLow.html(storedHistoric.forecast.forecastday[0].day.mintemp_f + "&deg");
        }
    }   
}

//GETS WEATHER DATA BASED ON VARIOUS SEARCH CRITERIA
function getWeather(query) {
    //FADES IN LOADING ICON
    $loading.fadeIn("fast");

    $historicTable.hide();
    historicPrinted = false;
    $datepicker.val("");


    // SETS QUERY URL FOR CURRENT AND FORECAST QUERIES
    var currentUrl = "https://api.apixu.com/v1/current.json?key=94999ca7d68e4e5a89a195033162111&q=" + query;
    var forecastUrl = "https://api.apixu.com/v1/forecast.json?key=94999ca7d68e4e5a89a195033162111&days=5&q=" + query;
    
    // CURRENT REQUEST
    $.ajax({
        dataType: "json",
        url: currentUrl,
        success: function (data) {
            $loading.fadeOut("fast");
            storedCurrent = data;
            printPanel();
        }
    });

    // FORECAST REQUEST
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

//GETS WEATHER BASED ON HISTORICAL DATE
function getHistoric(lat, lon, date){
    var historicUrl = "https://api.apixu.com/v1/history.json?key=94999ca7d68e4e5a89a195033162111&dt=" + date + "&q=" + lat + "," + lon;
    
    $.ajax({
        dataType: "json",
        url: historicUrl,
        success: function (data) {
            $loading.fadeOut("fast");
            storedHistoric = data;
            printHistoric();
        }
    });
}

//PRINTS DATA TO HISTORY TABLE
function printHistoric(){

    // HANDLES INVALID DATE
    if (storedHistoric.location === undefined){
        alert("Invalid Date");
        return null;
    }

    // CHANGES HISTORIC VARIABLES
    historicPrinted = true;
    $historicTable.show();

    $historicDate.text(storedHistoric.forecast.forecastday[0].date.substr(5));
    $historicImg.attr('src', "https:" + storedHistoric.forecast.forecastday[0].day.condition.icon);


    // this stays in this function rather than calling update units every time because this results in a reduced amount of code run despite it going against DRY
    if(units === "metric"){
        $historicHigh.html(storedHistoric.forecast.forecastday[0].day.maxtemp_c + "&deg");
        $historicLow.html(storedHistoric.forecast.forecastday[0].day.mintemp_c + "&deg");
    } else {
        $historicHigh.html(storedHistoric.forecast.forecastday[0].day.maxtemp_f + "&deg");
        $historicLow.html(storedHistoric.forecast.forecastday[0].day.mintemp_f + "&deg");
    }

}

//PRINTS NON-HISTORICAL DATA TO MAIN PANELS
function printPanel() {

    //handles case where search returned no value
    if (storedCurrent.location === undefined) {
        alert("Invalid Search");
        return null;
    }

    // sets all the  CURRENT NON UNIT values from stored CURRENT return location
    $locationName.text(storedCurrent.location.name + ", " + storedCurrent.location.region + ", " + storedCurrent.location.country);
    $currentDescription.text(storedCurrent.current.condition.text);
    $currentImg.attr('src', "https:" + storedCurrent.current.condition.icon);
    $windDir.removeClass();
    $windDir.addClass("wi wi-wind wi-towards-" + storedCurrent.current.wind_dir.toLowerCase());
    $humidity.text(storedCurrent.current.humidity);
    $cloud.text(storedCurrent.current.cloud);

    // sets all the FORECAST NON UNIT values from stored FORECAST return location
    $dates.each(function (i) {
        $(this).text(storedForecast.forecast.forecastday[i].date.substr(5));
    });
    $forecastImgs.each(function (i) {
        $(this).attr('src', "https:" + storedForecast.forecast.forecastday[i].day.condition.icon);
    });

    updateUnits();
}

//HANDLES AUTO COMPLETE ON SEARCH BAR
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
        }
    });
});