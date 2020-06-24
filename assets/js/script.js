$(document).ready(function() {
    //array to store brewery data objects
    var breweries = [];
    //replace with UI from front end selector
    var city = prompt("Enter City Name")
    var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + city;

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        //remove console log before final release
        console.log(response);
        //iterates through array of breweries creating objects and filling array for program use
        for (var i=0; i < 20; i++){
            var breweryData = {
            }
            breweryData.name = response[i].name;
            breweryData.lat = response[i].latitude;
            breweryData.lon = response[i].longitude;
            breweries.push(breweryData);
        }
        //remove console log before final release
        console.log(breweries);
      })




})