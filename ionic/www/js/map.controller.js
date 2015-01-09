angular.module('radar')
.controller('MapController', [
	'MapFactory', 
	'MapSearchFactory', 
	'MarkerFactory', 
	'HttpHandler', 
  '$ionicModal',
	'$scope', 
	function(Map, SearchBox, Marker, Http, $ionicModal, $scope) {

    var listOfMarkers = {};
  
    $scope.geoLocate = function(){
      console.log("LOCATING.......");
      Map.geoCenter();
    };

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    var map = Map.initialize();

    var myMarker = Map.geoLocate(function(location) {
      listOfMarkers.location = {'lat': location.latitude, 'lng': location.longitude};
      console.log("LIST OF MARKERS: ", listOfMarkers);
    });


    Http.getMarkers(function(events) {
      Marker.placeMarkers(map, events, function(markers) {
        console.log("EVENTS: ", events);
        //store marker location and events inside scope for now
        listOfMarkers.events = events;

        for (var i = 0; i < markers.length; i++) {
          var title = events[i].title;
          var marker = markers[i];
          var event = events[i];
          //must invoke function in order to grab current marker, title, and rating
          google.maps.event.addListener(marker, 'click', (function(marker, event) {
            return function() {
              $ionicModal.fromTemplateUrl('../templates/eventInfoModal.html', {
                scope: $scope,
              }).then(function(modal) {
                $scope.modal = modal;
                $scope.openModal();
              });
              $scope.title = event.title;
              $scope.info = event.info;
              $scope.startTime = event.startTime;
              $scope.endTime = event.endTime;
            };
          })(marker, event));
        }
      });
    });

    this.filter = function(filters) {
      Marker.filterMarkers(map, listOfMarkers, filters);
    };

}]);
