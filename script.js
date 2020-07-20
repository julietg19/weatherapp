// creating starter
var cityData = ["Austin", "Houston", "Beaumont"];
var allCities = JSON.parse(localStorage.getItem("cityKey"));
// on windows load, I want to have some cities inside the dashboard to click
$(window).on("load", function () {
  localStorage.setItem("cityKey", JSON.stringify(cityData));
  searchCity("Austin");
});
// on click of search button I want to add that new city into allCities
$("#searchBtn").click(function () {
  var inputVal = $("#searchTerm").val();
  allCities.push(inputVal);
  // adding that new city to localstorage
  localStorage.setItem("cityKey", JSON.stringify(allCities));
  // Pass the current city name to the searchCity function to create a button
  searchCity(inputVal);
});
// creating a button for cities
function searchCity(cityName) {
  // Empty out current added cities
  $("#recentSearch").empty();
  for (var i = 0; i < allCities.length; i++) {
    console.log(allCities[i]);
    var cityButton = $("<li>")
      .text(allCities[i])
      .addClass("list-group-item btn cityClicked")
      .val(i);
    $("#recentSearch").append(cityButton);
  }
  // Call the API and display results
  apiCall(cityName);
}
// on click of the city show the weather
$(document).on("click", ".cityClicked", function () {
  var showCity = $(this).val();
  console.log(allCities[showCity]);
  apiCall(allCities[showCity]);
});
// get info from API
function apiCall(cityName) {
  var API = "1a6885d54419d4453b344a531aaae2c9";
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API}`;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // convert K to f
    var tempF = (response.list[0].main.temp - 273.15) * 1.8 + 32;
    // convert windspeed to m/h
    var windspeed = response.list[0].wind.speed * 2.237;
    // humidity
    var humidity = response.list[0].main.humidity;
    // latitude & longitude
    var lat = response.city.coord.lat;
    var lon = response.city.coord.lon;
    // New HTML

    var newHtml = `
        <h4>${moment().format("(M/D/YYYY)")}</h4>
        <h2>${cityName}</h2>
        <img src ="https://openweathermap.org/img/wn/${
          response.list[0].weather[0].icon
        }@2x.png" />
        <br>
        <p>Temperature: ${tempF.toFixed(0)}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Windspeed: ${windspeed.toFixed(2)}</p>
        `;
    // UV Index Function
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/uvi?appid=${API}&lat=${lat}&lon=${lon}`,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var uv = response.value;
      console.log(uv);
      $("#pop").append(`<p>UV: ${uv}</p>`);
    });
    $("#pop").html(newHtml);

    //5 day forecast
  
    const weatherDates = [0, 8, 16, 24, 32];
    let dateBlock = function (x) {
      let a = $("<div>")
        .addClass("bg-info p-3 mr-3 text-dark")
        .text(response.list[x].dt_txt.substring(0, 10));
      let b = $("<img>")
        .attr(
          "src",
          "https://openweathermap.org/img/w/" +
            //passing x value
            response.list[x].weather[0].icon +
            ".png"
        )
        .attr("width", 100);
      let c = $("<p></p>")
        .text(
          // passing x value
          Math.round((response.list[x].main.temp - 273.17) * 1.8 + 32) + "˚F"
        )
        .addClass("h3");
      let d = $("<p></p>").text("Humidity: " + response.list[x].main.humidity);
      // e is the empty div
      let e = $("<div>");
      e.append(a, b, c, d);
      $("#forecast").append(e);
    };
    for (let index = 0; index < weatherDates.length; index++) {
      //x = 24
      //dateBlock(x) = dateBlock(24)
      dateBlock(weatherDates[index]);
    } //our date block is similar
  });
}
