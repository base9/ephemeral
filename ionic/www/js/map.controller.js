angular.module('radar')
.controller('MapController', [
	'MapFactory', 
	'MapSearchFactory', 
	'MarkerFactory', 
	'HttpHandler', 
	'$scope', 
	function(Map, SearchBox, Marker, Http, $scope) {
  
  $scope.geoLocate = function(){
    console.log("LOCATING.......")
    Map.geoCenter();
  }

  $scope.saveNewEvent = function() {
  	console.log("Saving Event.....")
  }

  var map = Map.initialize();
  var myMarker = Map.geoLocate();


  Http.getMarkers(function(events) {
    Marker.placeMarkers(map, events, Http);
  });

}])
