import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj.js";
import { toStringHDMS } from "ol/coordinate.js";
import Overlay from "ol/Overlay.js";
import { defaults as defaultControls, Control } from "ol/control.js";
var request = require("request");

var locations;
var location;
var platform = new H.service.Platform({
  app_id: "WKaV3ZYegGwN1CsGJtz4",
  app_code: "IHeCfcws9gZjqyuyOQ-mKQ"
});
document.getElementById("locationSubmit").addEventListener("click", function() {
  var location = document.getElementById("locationInput").value;
  console.log(location);
  var geocodingParams = {
    searchText: location
  };
  geocoder.geocode(geocodingParams, onResult, function(e) {
    alert(e);
  });
});

//Note: Do all the map adjustments in this function
// Define a callback function to process the geocoding response:
var onResult = function(result) {
  locations = result.Response.View[0].Result;
  // Add a marker for each location found
  var i = 0;
  for (i; i < locations.length; i++) {
    console.log("lat: " + locations[i].Location.DisplayPosition.Latitude);
    console.log("long: " + locations[i].Location.DisplayPosition.Longitude);
  }
  var locationLatLong = fromLonLat([
    locations[0].Location.DisplayPosition.Longitude,
    locations[0].Location.DisplayPosition.Latitude
  ]);
  view.animate({
    center: locationLatLong,
    duration: 2000,
    zoom: 15
  });
  var query =
    "http://api.openweathermap.org/data/2.5/weather?lat=" +
    locations[0].Location.DisplayPosition.Latitude +
    "&lon=" +
    locations[0].Location.DisplayPosition.Longitude +
    "&&AppID=5048c430cd4add92963e0c737d40437f";
  console.log(query);

  request(query, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var importedJSON = JSON.parse(body);
      console.log(importedJSON);
    }
  });
};

// Get an instance of the geocoding service:
var geocoder = platform.getGeocodingService();

var view = new View({
  center: [0, 0],
  zoom: 3,
  minResolution: 1
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      preload: 4,
      source: new OSM()
    })
  ],
  view: view
});
