$(document).ready(function() {
  //user inputs city name 
  var city;
   //array to store brewery data objects
   var breweries = [];
   //global API key
  var apikey = "&apiKey=425ab7232cfd4b4daef2517d6b92595b";

  var brewDataBox = $(".breweryData");

  //get city name from search input
$(".searchButton").on("click",function(){
  event.preventDefault();
    //clear previous searches from list
    resetMap();
  city = $(".searchInput").val();
   //call function to center map
   centerMap();
  //call function to get brewery data
  getBrewData(1);
  getBrewData(2);
  })

  //if user presses enter key
  $(".searchInput").keyup(function(event){
    if(event.which === 13){
      event.preventDefault();
      //clear previous searches from list
      resetMap();
      city = $(".searchInput").val();
      //call function to center map
      centerMap();
      //call function to get brewery data
      getBrewData(1);
      getBrewData(2)
    }
  })

  //reset data function
  function resetMap(){
    $(".breweryData").empty();
    $(".beer").remove();
    breweries = [];
  }

//use GEOcoding to center map on city coordinates
function centerMap(){
var queryURL =  "https://api.geoapify.com/v1/geocode/search?text=" + city + "&type=city" + apikey;
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(data){
  // console.log(data);
  //lat and lon of searched city
  var lon = data.features[1].properties.lon;
  var lat = data.features[1].properties.lat;
  // map zooms to city coordinates
  map.flyTo({center: [lon,lat], zoom: 9})
})
}

//get data from openBreweryDB API
function getBrewData(x){
    //replace with UI from front end selector
    var perPage = "&per_page=50";
    var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + city +"&page="+ x + "&per_page=50";

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
        //render brewery data to page
        renderBrewData();
      })

}

//Removes breweries with null lat and lon from breweries array
function arrayCleaner(){
  for (var i=0; i< breweries.length; i++){
    if (breweries[i].lat === null || breweries[i].lon === null){
      breweries.splice(i);
    }
  }
}

//Populates map with markers from breweries array
function populateMap(){
  //creates the element for icon
  var beerIcon =[];
  for(let j = 0;j<breweries.length;j++){
    var lat = breweries[j].lat;
    var lon = breweries[j].lon;
    beerIcon[j] = document.createElement('div');
    beerIcon[j].classList.add("beer");
    beerIcon[j].classList.add(j + "beer");
    //creates popup
    var popup = new mapboxgl.Popup({
      anchor: 'bottom',
      offset: [0, -42] // height - shadow
    })
    .setText(breweries[j].name + breweries[j].website + breweries[j].phone);
    //creates marker
    var beerMarker = new mapboxgl.Marker(beerIcon[j], {
    anchor: 'bottom',
    offset: [0, 6]
  })//places marker and popup on map
    .setLngLat([lon, lat])
    .setPopup(popup)
    .addTo(map);
 }
}

//Render brewery data to brewDataBox

function renderBrewData(){
  //reveal brewDataBox 
  brewDataBox.removeClass("hide");
  //iterate through array of breweries
  for(let i = 0;i<breweries.length;i++){
    var brewery = $("<li>");
    brewery.addClass("collection-item");
    brewery.addClass(i + "beer");
    brewery.addClass(i + "beer");
    var breweryName = $("<p>");
    breweryName.text(breweries[i].name);
    brewery.append(breweryName);
    var breweryWebsite = $("<a>");
    breweryWebsite.text(breweries[i].website);
    breweryWebsite.attr("href", breweries[i].website);
    brewery.append(breweryWebsite);
    var breweryPhone = $("<p>");
    breweryPhone.text(breweries[i].phone);
    brewery.append(breweryPhone);
    var phoneIcon = $("<i>");
    phoneIcon.text("call");
    phoneIcon.addClass("material-icons");
    breweryPhone.addClass("phoneIcon");
    breweryPhone.prepend(phoneIcon);
    brewDataBox.prepend(brewery);
  }
}

})
