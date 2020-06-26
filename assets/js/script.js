$(document).ready(function() {
       //array to store brewery data objects
       var breweries = [];

  function getBrewData(){
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
            //call reverse geoCoding
            // reverseGeoCoding(breweries[1].lat, breweries[1].lon);
            
          })
  }

      function arrayCleaner(){
        for (var i=0; i< breweries.length; i++){
          if (breweries[i].lat === null || breweries[i].lon === null){
            breweries.splice(i);
          }
        }
      }
  console.log(breweries);
  //call function to get brewery data
  getBrewData();




  //used to center on lon, lat
//   var map = new mapboxgl.Map({
//     center: [-122, 42],
//     zoom: 9,
//     container: 'my-map',
//     style: `https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=425ab7232cfd4b4daef2517d6b92595b`,
//   });
//   //creates the element for icon
//   var beerIcon = document.createElement('div');
// beerIcon.classList.add("beer");

// var airport = new mapboxgl.Marker(beerIcon, {
//     anchor: 'bottom',
//     offset: [0, 6]
//   })
//   .setLngLat([-122, 42])
//   .addTo(map);
})