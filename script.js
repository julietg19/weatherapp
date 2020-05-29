// https://api.openweathermap.org/data/2.5/forecast?appid=1a6885d54419d4453b344a531aaae2c9

// search city function

var cityData = [];

function searchCity() {
  for (var i = 0; i < cityData.length; i++) {
    var cityButton = $("<button>").text(cityData[i]);

    $("#recentSearch").append(cityButton);
  }
}

$("#searchBtn").click(function () {
  var inputVal = $("#searchTerm").val();
  cityData.push(inputVal);
  searchCity();
});

// ajax call

function call() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?appid=1a6885d54419d4453b344a531aaae2c9";
}

// saved in local storage and presented until another city is searched
