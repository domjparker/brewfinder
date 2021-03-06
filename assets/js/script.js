$(document).ready(function() {
  //user inputs city name 
  var city;
   //array to store brewery data objects
   var breweries = [];
   //global API key
  var apikey = "&apiKey=425ab7232cfd4b4daef2517d6b92595b";
  var selectors = [];
  var brewDataBox = $(".breweryData");
  

  //get city name from search input
$(".searchButton").on("click",function(event){
  event.preventDefault();
    //clear previous searches from list
    resetMap();
  city = $(".searchInput").val();
   //call function to center map
   centerMap();
  //call function to get brewery data
  getBrewData(1);
  //getBrewData(2);
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
      //getBrewData(2)
    }
  })

  //reset data function
  function resetMap(){
    $(".breweryData").empty();
    brewDataBox.addClass("hide");
    $(".beerYum").remove();
    breweries = [];
    selectors = [];
  }

//use GEOcoding to center map on city coordinates
function centerMap(){
  //restric results to west coast
  var westCoast = "&bias=rect:-130.20324685239348,29.38890919715537,-101.11144997739359,51.94902867991925|countrycode:us,ca";
  var queryURL =  "https://api.geoapify.com/v1/geocode/search?text=" + city + "&type=city" + westCoast + apikey;
  // console.log(queryURL);
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
        // console.log(response);
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
        // console.log(breweries);
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
    beerIcon[j].classList.add("beerYum");
    beerIcon[j].classList.add(j + "beer");
    //creates popup
    var popup = new mapboxgl.Popup({
      anchor: 'bottom',
      offset: [0, -42] // height - shadow
    })
    .setText(breweries[j].name);
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

    var breweryName = $("<p>");
    breweryName.text(breweries[i].name);
    brewery.append(breweryName);
    var breweryWebsite = $("<a>");
    breweryWebsite.text(breweries[i].website);
    breweryWebsite.attr("target","_blank");
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
    var breweryButton = $("<button>");
    breweryButton.attr("type", "button");
    breweryButton.addClass("addRouteBtn");
    breweryButton.text("Add to Route");
    breweryButton.attr("id", i + "");
    breweryButton.on("click",function(event){
      event.preventDefault();
      $(this).css("background-color", "#F2C351");
      selector = $(this).attr("id");
      selectors.push(parseInt(selector));
      console.log(selectors);
    })
    brewery.append(breweryButton);
    brewDataBox.prepend(brewery);
  }
}

$("#displayRoute").click(function(event){
    event.preventDefault();
    generateRoute()

})
// initialization for materialize sidenav in each page
$(document).ready(function(){
  $('.sidenav').sidenav();
});
function generateRoute(){
  var string = ""
  for (var f = 0; f< selectors.length; f++){
  var x = breweries[selectors[f]].lat;
  var y = breweries[selectors[f]].lon;
  if ( f === 0){
    string = x + "," + y;
  } else {
      string = string + "|" + x + "," + y ;
    }
  }
  // console.log(string);
  addRouteMarkers();
}

var routeMarkers = []; 

function displayRoute(string){
  queryURL = "https://api.geoapify.com/v1/routing?waypoints=" + string +  "&mode=drive" + apikey;
  // console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(data){
    console.log(data);
    for(let v = 0;v<data.properties.waypoints.length;v++){
      routeMarkers.push(data.properties.waypoints[v]);
      // console.log(routeMarkers);
    };
    // console.log(routeMarkers);
    //remove old markers from page
    
    //addRouteMarkers();
    
  })
}

function addRouteMarkers(){
  //creates the element for icon
  var beerIcon =[];
  for(let j = 0;j<selectors.length;j++){
    var lat = breweries[selectors[j]].lat;
    var lon = breweries[selectors[j]].lon;
    // console.log(lat);
    // console.log(lon);
    beerIcon[selectors[j]] = document.createElement('div');
    beerIcon[selectors[j]].classList.add("beer");
    beerIcon[selectors[j]].classList.add(j + "beer2");
    //creates popup
    var popup = new mapboxgl.Popup({
      anchor: 'bottom',
      offset: [0, -42] // height - shadow
    })
    .setText(breweries[selectors[j]].name);
    //creates marker
    var beerMarker = new mapboxgl.Marker(beerIcon[selectors[j]], {
    anchor: 'bottom',
    offset: [0, 6]
  })//places marker and popup on map
    .setLngLat([lon, lat])
    .setPopup(popup)
    .addTo(map);
    
 }
 resetMap();
}
})

