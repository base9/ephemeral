angular.module('starter')
.factory('MapSearchFactory', function () {
  var searchObj = {};

  searchObj.initialize = function (map) {
    var input = (document.getElementById('pac-input'));

    // Positions the search box to the top left corner
    // FIXME: map is global 
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox(input);
    
    // expose searchBox
    searchObj.searchBox = searchBox;
  }

  return searchObj;
})