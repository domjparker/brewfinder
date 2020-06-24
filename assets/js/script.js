$(document).ready(function() {

    var city = prompt("Enter City Name")
    var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + city;

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
      })




})