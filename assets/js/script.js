//get the weather information from the API
const apiId = "9fc458557b2ca6684dc057eb5782a51f";
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#city-name");
var searchHistory = [];

var clearPriorSearch = function() {
$(".today-report").find("p").detach();
$(".today-report").find("h2").detach();

$(".forecast-section").children().detach();
}

var loadHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("search-history"));

    if(!searchHistory) {
        searchHistory = [];
    }

   for (i=0; i<searchHistory.length; i++) {
       
    console.log(searchHistory[i]);
    createHistoryButton(searchHistory[i]);
    // console.log($(".search-history"));
    // $(".search-history").append("<button>"+searchHistory[i]+"</button><br>");
    }
}

$(".search-history").on("click",".btn", function(){
    var cityName = $(this).text().trim();
    clearPriorSearch();
    getCityForecast(cityName);
    console.log(cityName);
})
var createHistoryButton = function(string) {
    var buttonListEl = $("<li>");
    var buttonEl = $("<button>")
        .addClass("btn btn-secondary shadow")
        .text(string);
    buttonListEl.append(buttonEl);
    $(".search-history").prepend(buttonListEl);
}


var formSubmitHandler = function(event) {
    event.preventDefault();
    //clear the screen
    //save the prior search city to localStorage
    // Create a button below the search bar with the prompt
    clearPriorSearch();

    var cityName = nameInputEl.value.trim();
    // $(".search-history").append("<button>"+cityName+"</button><br>");
    // if (cityName in)
    if(!searchHistory.includes(cityName)){
    searchHistory.push(cityName);
    console.log(searchHistory);
    createHistoryButton(cityName);
    }
    saveHistory();
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
        console.log(data);
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
        console.log(data.current.weather[0].icon);
        postCityToday(data);
    })})
}
var testUvIndex = function(integer){
    let uvStatus = "";
    if(integer<=2) {
        uvStatus = "bg-success";
    }
    else if (integer>2 && integer < 6) {
        uvStatus = "bg-warning";
    }
    else {
        uvStatus = "bg-danger";
    }
    return uvStatus;
}
var postCityToday = function(data) {
    weatherIcon = data.current.weather[0].icon;
    uvIndex = data.current.uvi;
    uvStatus = testUvIndex(uvIndex);
    console.log(uvIndex, uvStatus);
    $(".today-report").find("h2").append("<img src=http://openweathermap.org/img/wn/" + weatherIcon + ".png />");
    $(".today-report").find(".col-12").append("<p>Temperature: "+data.current.temp+" &#8457</p>")
    $(".today-report").find(".col-12").append("<p>Humidity: "+data.current.humidity+"%</p>")
    $(".today-report").find(".col-12").append("<p>Wind-speed: "+data.current.wind_speed+"mph</p>")
    $(".today-report").find(".col-12").append("<p class="+uvStatus+">UV index: "+uvIndex+"</p>")

}

var postCityForecast = function(data) {
    cityName = data.city.name;
    var todayDate = moment().format("ddd, MMMM Do YYYY");
    var todayHeader = $("<h2 class = 'bg-primary city-info'>")
        .text(cityName+" ("+todayDate +") ");
    $(".today-report").find(".col-12").append(todayHeader);
    $(".forecast-section").html("<h2>5 day forecast</h2>");

    var dayForecast = 1;
    for(i=0; i<40; i+=8) {
        var formattedDate = moment(data.list[i].dt_txt, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY");
        weatherIcon = data.list[i].weather[0].icon;
        var forecastCardContainerEl= $("<div>")
            .addClass("col-12 col-lg-2 card ms-auto bg-primary");
        var forecastCardBodyEl = $("<section>")
            .addClass("card-body ms-auto data-id");
        var forecastCardTitleEl = $("<h5>")
            .addClass("card-title")
            .text(formattedDate);
        var forecastIcon = $("<img>")
            .attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png");
        var forecastCardTempEl = $("<p>")
            .addClass("card-text temp-class")
            .html("Temp: "+data.list[i].main.temp + "&#8457");
        var forecastCardHumidEl = $("<p>")
            .addClass("card-text humid-class")
            .text("Humidity: "+data.list[i].main.humidity+"%");
        forecastCardBodyEl.append(forecastCardTitleEl, forecastIcon, forecastCardTempEl, forecastCardHumidEl);
        forecastCardContainerEl.append(forecastCardBodyEl);
        $(".forecast-section").append(forecastCardContainerEl);
        // $(".data-id-" + dayForecast).find(".card-title").append(data.list[i].dt_txt);
        // $(".data-id-" + dayForecast).find(".temp-class").append(data.list[i].main.temp);
        // $(".data-id-" + dayForecast).find(".humid-class").append(data.list[i].main.humidity, "%");
        dayForecast++;
        // console.log(data.list[i].main.temp, data.list[i].main.humidity);
    }

}

var saveHistory = function() {
    if(searchHistory.length>5) {
        searchHistory.shift();
        console.log(searchHistory);
    }
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
}
// getCityForecast();
userFormEl.addEventListener("submit", formSubmitHandler)
loadHistory();
//city name is data.city.name
//latitude is data.city.coord.lat
//longitude is data.city.coord.lon
//temperature is data.list[day in 8hr intervals].main.temp
//humidity is dta.list[day in 8hr intervals].main.humidity
//date is data.list[day in 8hr intervals].dt_txt
//image is data.current.weather[0].icon
//http://openweathermap.org/img/wn/" + weatherIcon + ".png" 