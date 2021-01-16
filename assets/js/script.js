//get the weather information from the API
const apiId = "9fc458557b2ca6684dc057eb5782a51f";
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#city-name");

var clearPriorSearch = function() {
$(".today-report").find("p", "h2").detach();
$("data-id-1").find("p").empty();
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    //clear the screen
    //save the prior search city to localStorage
    // Create a button below the search bar with the prompt
    clearPriorSearch();

    var cityName = nameInputEl.value.trim();
    $(".search-history").append("<button>"+cityName+"</button><br>");
    if (cityName) {
        getCityForecast(cityName);
        nameInputEl.value = "";
    }
    else {
        alert("Please enter a valid city name");
    }
    // console.log(username);
    // console.log(event);
}



var getCityForecast = function(cityName) {
    
fetch("https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&units=imperial&appid="+apiId)
.then(function(response){
    response.json()
    .then(function(data){
        postCityForecast(data);
        var lat = data.city.coord.lat;
        var lon = data.city.coord.lon;
        var cityName = data.city.name;
        fetchTodayData(lat, lon);
    });
})
// one call is fetch("https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}")
}

var fetchTodayData = function(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+apiId)
    .then(function(response){response.json()
    .then(function(data){
        console.log(data);
        postCityToday(data);
    })})
}

var postCityToday = function(data) {
    

    $(".today-report").find(".col-12").append("<p>Temperature: "+data.current.temp+" degrees Fahrenheit</p>")
    $(".today-report").find(".col-12").append("<p>Humidity: "+data.current.humidity+"%</p>")
    $(".today-report").find(".col-12").append("<p>Wind-speed: "+data.current.wind_speed+"kn</p>")
    $(".today-report").find(".col-12").append("<p>UV index: "+data.current.uvi+"</p>")

}

var postCityForecast = function(data) {
    cityName = data.city.name;
    var todayDate = moment().format("ddd, MMMM Do YYYY");
    var todayHeader = $("<h2>")
    .text(cityName+" ("+todayDate +") ");
    $(".today-report").find(".col-12").append(todayHeader);

    var dayForecast = 1;
    for(i=0; i<40; i+=8) {
        $(".data-id-" + dayForecast).find(".card-title").append(data.list[i].dt_txt);
        $(".data-id-" + dayForecast).find(".temp-class").append(data.list[i].main.temp);
        $(".data-id-" + dayForecast).find(".humid-class").append(data.list[i].main.humidity, "%");
        dayForecast++;
        // console.log(data.list[i].main.temp, data.list[i].main.humidity);
    }

}
// getCityForecast();
userFormEl.addEventListener("submit", formSubmitHandler)
//city name is data.city.name
//latitude is data.city.coord.lat
//longitude is data.city.coord.lon
//temperature is data.list[day in 8hr intervals].main.temp
//humidity is dta.list[day in 8hr intervals].main.humidity
//date is data.list[day in 8hr intervals].dt_txt