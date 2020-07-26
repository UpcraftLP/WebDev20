'use strict';
const include = require('./include');

include('https://maps.googleapis.com/maps/api/js?key=AIzaSyDqf7hQc4I51qE3ZMtn5aArtNNY15Rxm5I&callback=googleMapsLoaded');

const mapQueue = [];
let mapsLoaded = false;
window.googleMapsLoaded = () => {
  mapsLoaded = true;
  while (mapQueue.length > 0) {
    createMapInternal(mapQueue.pop());
  }
};

const createMapInternal = value => {
  const processPoints = (geometry, callback, thisArg) => {
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else {
      geometry.getArray().forEach(function (g) {
        processPoints(g, callback, thisArg);
      });
    }
  };
  const map = new google.maps.Map(value.div, value.options);
  // zoom to show all the features
  const bounds = new google.maps.LatLngBounds();
  map.data.addListener('addfeature', function (e) {
    processPoints(e.feature.getGeometry(), bounds.extend, bounds);
    map.fitBounds(bounds);
  });

  // zoom to the clicked feature
  map.data.addListener('click', function (e) {
    const bound = new google.maps.LatLngBounds();
    processPoints(e.feature.getGeometry(), bound.extend, bound);
    map.fitBounds(bound);
  });

  // construct data URI and load geo json data
  map.data.loadGeoJson('data:application/geo+json;' + value.json);
};

const createMap = (mapDiv, mapOptions, json) => {
  const combined = { div: mapDiv, options: mapOptions, json: json };
  mapQueue.push(combined);
  if (mapsLoaded) {
    createMapInternal(combined);
    while (mapQueue.length > 0) {
      createMapInternal(mapQueue.pop());
    }
  }
};

module.exports.create = createMap;
