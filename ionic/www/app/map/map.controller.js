angular.module('radar')
.controller('MapController', [
	'MapFactory', 
	'MapSearchFactory', 
	'MarkerFactory', 
	'HttpHandler', 
  '$ionicModal',
	'$scope', 
	function(Map, SearchBox, Marker, Http, $ionicModal, $scope) {
  
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
  var myMarker = Map.geoLocate();


  Http.getMarkers(function(events) {
    Marker.placeMarkers(map, events, Http, function(markers) {
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
            $scope.title = event.title;
          };
        })(marker, event));
      }
    });
  });

}]);
