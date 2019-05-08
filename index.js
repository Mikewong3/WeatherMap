import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj.js";
import { toStringHDMS } from "ol/coordinate.js";
//import Overlay from "ol/Overlay.js";
import { defaults as defaultControls, Control } from "ol/control.js";
var request = require("request");
import TileDebug from "ol/source.js";
import XYZ from "ol/source/XYZ.js";
import { extend } from "ol/extent";
import PluggableMap from "ol/PluggableMap";
import imageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic.js";

var locations;
var location;
//ID for openlayersapi
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
  //This clears the weatherBox everytime a new search is made
  document.getElementById("weatherBox").innerHTML == "";
  var weatherIcon = document.getElementById("weatherIcon");
  if (weatherIcon != null) {
    weatherIcon.parentNode.removeChild(weatherIcon);
  }
  var weatherData = document.getElementById("weatherData");
  if (weatherData != null) {
    weatherData.parentNode.removeChild(weatherData);
  }
  //this calls the geocode api->gets the location->runs onResult function
  geocoder.geocode(geocodingParams, onResult, function(e) {
    alert(e);
  });
});
//Note: Do all the map adjustments in this function
// Define a callback function to process the geocoding response:
var onResult = function(result) {
  locations = result.Response.View[0].Result;
  // This gets all the lat/long for the searched address
  var i = 0;
  for (i; i < locations.length; i++) {
    console.log("lat: " + locations[i].Location.DisplayPosition.Latitude);
    console.log("long: " + locations[i].Location.DisplayPosition.Longitude);
  }
  //converts lat/long numbers to openlayers lat/long format
  var locationLatLong = fromLonLat([
    locations[0].Location.DisplayPosition.Longitude,
    locations[0].Location.DisplayPosition.Latitude
  ]);
  //This zooms into the search location
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
    "&units=imperial&AppID=5048c430cd4add92963e0c737d40437f";
  var weatherJSON = null;
  request(query, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      weatherJSON = JSON.parse(body);
      console.log(weatherJSON.weather);
      //this code here will generate the correct weatherIcon for the given location
      var imgscr = "";
      switch (weatherJSON.weather[0]["id"]) {
        case 800:
          imgscr = "/sunny.104d9cd4.png";
          console.log("This is correct");
          break;
        case 801:
        case 802:
        case 803:
        case 804:
          imgscr = "/cloudy.d8afbff7.png";
          console.log("Today");
          break;
        case 500:
        case 501:
        case 520:
        case 531:
          imgscr = "/moderaterrain.e3c5be1c.png";
          break;
        case 502:
        case 503:
        case 504:
        case 511:
        case 521:
        case 522:
          imgscr = "/heavyrain.15dd8b2c.png";
          break;
        case 200:
        case 201:
        case 202:
        case 211:
        case 212:
          imgscr = "/thunder.3fe68844.png";
          break;
        case 600:
          imgscr = "/thunder.3fe68844.png";
          break;
        case 601:
        case 602:
        case 611:
        case 612:
        case 613:
        case 615:
        case 616:
        case 620:
        case 621:
        case 622:
          imgscr = "/snow.af099d52.png";
          break;
        case 741:
        case 721:
          imgscr = "/fog.00544988.png";
          break;
      }
      console.log(imgscr);
      createWeatherBox(imgscr, weatherJSON.main["temp"]);
      document.getElementById("weatherBox").style.backgroundColor =
        "rgba(238, 246, 255, 0.7)";
    }
  });
};

//This function creates a weatherbox in the map after the search button is clicked
//It adds the img and puts the current temp in the weatherbox
function createWeatherBox(src, temp) {
  var weatherBox = document.getElementById("weatherBox");
  var weatherData = document.createElement("h1");
  weatherData.id = "weatherData";
  weatherData.innerHTML = temp;
  weatherBox.appendChild(weatherData);
  var weatherIcon = document.createElement("img");
  weatherIcon.src = src;
  weatherIcon.id = "weatherIcon";
  weatherIcon.setAttribute("height", "50px");
  weatherIcon.setAttribute("width", "50px");
  document.getElementById("weatherBox").appendChild(weatherIcon);
}
// Get an instance of the geocoding service:
var geocoder = platform.getGeocodingService();

var view = new View({
  center: [0, 0],
  zoom: 3,
  minResolution: 1
});

var map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: view
});

//These add custom controls/textbox/weatherInfoBox to the map
var locationSubmitButton = document.getElementById("locationSubmit");
var locationSubmit = new Control({
  element: locationSubmitButton,
  target: "ol-unselectable"
});
map.addControl(locationSubmit);

var location = document.getElementById("locationInputContainer");
var locationText = new Control({
  element: location,
  target: document.getElementById("ol-unselectable")
});
locationText.setMap(map);

var weatherBox = document.getElementById("weatherBox");
var weatherContainer = new Control({
  element: weatherBox
});
map.addControl(weatherContainer);

/*
var weatherLayer = new imageLayer({
  source: new Static({
    url: "http://pngimg.com/uploads/rain/rain_PNG13453.png",
    crossOrigin: ""
  })
});
map.addLayer(weatherLayer);

var osm = new OSM();
var graphic = new imageLayer(
  "Image",
  "http://pngimg.com/uploads/rain/rain_PNG13453.png",
  new bounds(27.4181, 35.7711, 28.388, 36.5585),
  new size(800, 255),
  { numZoomLevels: 3 }
);
map.addLayers([graphic, osm]);
*/
