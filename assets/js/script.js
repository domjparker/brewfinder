$(document).ready(function() {
       //array to store brewery data objects
       var breweries = [];

  function getBrewData(){
        //replace with UI from front end selector
        // var city = prompt("Enter City Name")
        // var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + city;
    
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
            reverseGeoCoding(breweries[1].lat, breweries[1].lon);
            
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


  //global vars for markers

  var markers = [];

  function reverseGeoCoding(lat, lon){
      //reverse geocoding api
      var apiKey = "&apiKey=04ff4fe9c2d14704a84586b6674f43c8";
      var queryURL = "https://api.geoapify.com/v1/geocode/reverse?lat=" + lat + "&lon=" + lon + "&lang=de&limit=10" + apiKey;
      // console.log(queryURL);

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(geojson){
        console.log(geojson)

        function showGeoJSONPoints(geojson) {

          if (markers.length) {
            markers.forEach(marker => marker.remove());
            markers = [];
          }
        
          // each feature contains 1 place
          geojson.features.forEach((feature, index) => {
            var markerIcon = document.createElement('div');
            markerIcon.classList.add("my-marker");
            // Icon size: 31 x 46px, shadow adds: 4px
            markerIcon.style.backgroundImage = `url(https://api.geoapify.com/v1/icon/?type=awesome&color=%233f99b1&text=${index + 1}&noWhiteCircle&apiKey=${myAPIKey})`;
        
            var popup = new mapboxgl.Popup({
                anchor: 'bottom',
                offset: [0, -42] // height - shadow
              })
              .setText(feature.properties.name);
        
            var marker = new mapboxgl.Marker(markerIcon, {
                anchor: 'bottom',
                offset: [0, 4] // shadow
              })
              .setLngLat(feature.geometry.coordinates)
              .setPopup(popup)
              .addTo(map);
        
            markers.push(marker);
          });
        }

      })
    
  }

})