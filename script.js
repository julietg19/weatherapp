// https://api.openweathermap.org/data/2.5/forecast?appid=1a6885d54419d4453b344a531aaae2c9

// search city function

//1a6885d54419d4453b344a531aaae2c9

var cityData = ["Austin", "Houston", "Beaumont"];

function searchCity(cityName) {
  // Creates set of past search buttons
  $("#recentSearch").empty();
  var getCity = cityData.concat(JSON.parse(localStorage.getItem("cityKey")));
  for (var i = 0; i < getCity.length; i++) {
    var cityButton = $("<button>")
      .text(getCity[i])
      .addClass("btn btn-info btn-block pb-2");

    // Add code to eliminate duplicates XXXXXXXXXXXXXX
    $("#recentSearch").append(cityButton);
  }

  // Call the API and display results
  apiCall(cityName);
}

$("#searchBtn").click(function () {
  var inputVal = $("#searchTerm").val();
  // cityData.push(inputVal);
  //localstorage

  localStorage.setItem("cityKey", JSON.stringify(inputVal));

  searchCity(inputVal); // Pass the current city name to the searchCity function
});

// ajax call

var API = "1a6885d54419d4453b344a531aaae2c9";

var lastCitySearched = " ";

function apiCall(cityName) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast" +
    "?q=" +
    cityName +
    //"&cnt=5" +
    "&appid=" +
    API;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // Response is in JSON format
    // Get temp, humidity, windspeed and UV index
    console.log(response);
    var humidity = response.list[0].main.humidity;
    var uv = 0;
    var newHtml = `<h3>${cityName} ${moment().format("(M/D/YYYY)")}</h3>
    <img src ="https://openweathermap.org/img/wn/${
      response.list[0].weather[0].icon
    }@2x.png" />`;

    // convert c to f

    var tempF = (response.list[0].main.temp - 273.15) * 1.8 + 32;

    // convert windspeed to m/h

    var windspeed = response.list[0].wind.speed * 2.237;

    // latitude & longitude

    var lat = response.city.coord.lat;

    var lon = response.city.coord.lon;

    // UV Index Function

    function uvIndex(lat, lon) {
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?appid={${API}}&lat={${lat}}&lon={${lon}}`,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        return response;
      });
    }

    var uvResult = uvIndex(lat, lon);
    console.log(uvResult);
    //  display output

    newHtml += "<p>Temperature: " + tempF.toFixed(0) + "°F" + "</p>\n";

    newHtml += "<p>Humidity: " + humidity + "%" + "</p>\n";

    newHtml += "<p>Wind Speed: " + windspeed.toFixed(1) + "MPH" + "</p>\n";

    $("#pop").html(newHtml);
  });
}

// present 5 day forecast

//lastCitySearched logic - when i search a city, it creates a button for that city (line 8-13), when i click that button i want to see the data for that city again
