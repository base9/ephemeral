angular.module('starter')
.controller('MapController', ['MapFactory', 'MapSearchFactory', 'MarkerFactory', 'HttpHandler', function(Map, SearchBox, Marker, Http) {
  
  var map = Map.initialize();
  var myMarker = Map.geoLocate();

  SearchBox.initialize(map);

  var goToPlace = function () {
    var places = SearchBox.searchBox.getPlaces();
    if (places.length) {
      Map.goToPlace(places[0])
    }
  }

  google.maps.event.addListener(SearchBox.searchBox, 'places_changed', goToPlace);

  Http.getMarkers(function(title, places) {
    Marker.placeMarkers(map, title, places, Http);
  });

}])