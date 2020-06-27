$(document).ready(function() {
  //user inputs city name 
  // var city = prompt("Enter City Name");
  var city;
   //array to store brewery data objects
   var breweries = [];
   //global API key
  var apikey = "&apiKey=425ab7232cfd4b4daef2517d6b92595b"

  //get city name from search input

$(".searchButton").on("click",function(){
  event.preventDefault();
  city = $(".searchInput").val();
  //call function to get brewery data
  getBrewData();
  //call function to center map
  centerMap();
  })

//use GEOcoding to center map on city coordinates
function centerMap(){
var queryURL =  "https://api.geoapify.com/v1/geocode/search?text=" + city + "&type=city" + apikey;
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(data){
  console.log(data);
  console.log(data.features[1].properties.lat);
  console.log(data.features[1].properties.lon);
  //lat and lon of searched city
  var lon = data.features[1].properties.lon;
  var lat = data.features[1].properties.lat;
  // map zooms to city coordinates
  map.flyTo({center: [lon,lat], zoom: 9})
})
}

function getBrewData(){
    //replace with UI from front end selector
    var perPage = "&per_page=50";
    var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + city + perPage;

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        //remove console log before final release
        console.log(response);
        //iterates through array of breweries creating objects and filling array for program use
        for (var i=0; i < response.length; i++){
            var breweryData = {
            }
            breweryData.name = response[i].name;
            breweryData.lat = response[i].latitude;
            breweryData.lon = response[i].longitude;
            breweryData.phone = response[i].phone;
            breweryData.website = response[i].website_url;
            breweryData.address = response[i].street;
            breweries.push(breweryData);
            arrayCleaner();
        }
        //remove console log before final release
        console.log(breweries);
        //populate the map with markers
        populateMap();
      })
}

//Populates map with markers from breweries array
function populateMap(){
    //creates the element for icon
    for(let j = 0;j<breweries.length;j++){
      var lat = breweries[j].lat;
      var lon = breweries[j].lon;
    var beerIcon2 = document.createElement('div');
    beerIcon2.classList.add("beer");
  
  var airport2 = new mapboxgl.Marker(beerIcon2, {
      anchor: 'bottom',
      offset: [0, 6]
    })
    .setLngLat([lon, lat])
    .addTo(map);
    
    }
}

//Removes breweries with null lat and lon from breweries array
  function arrayCleaner(){
    for (var i=0; i< breweries.length; i++){
      if (breweries[i].lat === null || breweries[i].lon === null){
        breweries.splice(i);
      }
    }
  }

})
