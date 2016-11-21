var $searchInput = $('#searchInput');
var $goButton = $('#goButton');
var $results = $('#results');


function getWeather(callback, query) {
    console.log("Getting here!");
    var weather = 'http://api.openweathermap.org/data/2.5/find?q=' + query + '&type=accurate&appid=9b487de8cb6160f9df489c31f523eb98&units=imperial';
    $.ajax({
      dataType: "jsonp",
      url: weather,
      success: callback
    });
}

$goButton.click(function(e){    
    e.preventDefault();
    getWeather(function (data) {
    console.log(data);
    printData(data.list[0]);
}, $searchInput.val());});


function printData(data){
    console.log(data);
    // $.each(data, function(){
        var lb = "<br>";
        var name = data.name;
        var country = data.sys.country;
        var weather = data.weather[0].main;
        var weatherDescription = data.weather[0].description;
        var temp = data.main.temp;
        var tempMin = data.main.temp_min;
        var tempMax = data.main.temp_max;
        var windSpeed = data.wind.speed;
        var windDeg = data.wind.deg;

        $results.html(
            name + ", " + country + lb +
            weather + lb +
            weatherDescription + lb +
            temp + " " + tempMin + " " + tempMax + lb);
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