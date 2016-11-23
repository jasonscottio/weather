



function getLocation() {
    //checks to see if there is valid geo data
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // sends position to callback to find weather
            var coords = position.coords.latitude + "," + position.coords.longitude;
            getWeather(coords);
        });
    } else { //TODO: red handle default behavior
        //handle no geo data
        alert("Your Browser Does Not Support Geographical Information");
    }
}


// default
getWeather("Gothenburg");

// search
$goButton.click(function (e) {
    e.preventDefault();
    getWeather($searchInput.val());
});

// position
//sets up pos button to get geo weather
$posButton.click(function(e){
    e.preventDefault();
    getLocation();
});

function getWeather(query) {
    //sets url variable with query
    var url = "https://api.apixu.com/v1/current.json?key=94999ca7d68e4e5a89a195033162111&q=" + query;
    //displays loading graphic
    $loading.css("display", "block");
    //sends request
    $.ajax({
        dataType: "json",
        url: url,
        success: handleData
    });
}

function handleData(data){
    $loading.css("display", "none");
    console.log(data);
    stored = data;
    printPanel();
}