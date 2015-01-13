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

    function isoDateToTimeString(date) {
      var date = new Date(date);
      var hours = date.getHours();
      var mins = date.getMinutes();
      var ampm;
      (mins === 0) ? mins = ':00' : mins = ':' + mins;
      (hours > 11) ? ampm = 'pm' : ampm = 'am';
      if (hours > 12 || hours === 0) {
        hours = Math.abs(hours-12);
      }
      return hours+mins+ampm
    }

    Map.geoLocate(function(location, bounds) {
      listOfMarkers.location = {'lat': location.latitude, 'lng': location.longitude};
      listOfMarkers.bounds = {ne: bounds.getNorthEast(), sw: bounds.getSouthWest()};
      console.log("BOUNDS: ", listOfMarkers.bounds);
      console.log("LIST OF MARKERS: ", listOfMarkers);

      Http.getMarkers(listOfMarkers.bounds, function(events) {
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
                $ionicModal.fromTemplateUrl('./app/modals/eventInfoModal.html', {
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
    });

  
  this.filters = {distance: 0, popularity: 0, time: {now: false, startTime: null, endTime: null}, cost: 0, keyword: null};

  this.filter = function() {
    console.log("FILTERS", this.filters);
    if (!this.show) {
      this.filters.time.now = true;
    }
    if (this.filters.distance === 0) {
      this.filters.distance = null;
    }
    if (this.filters.popularity === 0) {
      this.filters.popularity = null;
    }
    Marker.filterMarkers(map, listOfMarkers, this.filters);
    this.filters = {distance: 0, popularity: 0, time: {now: false, startTime: null, endTime: null}, cost: 0, keyword: null};
  };

  this.show = false;

  this.showTime = function(show) {
    this.show = show;
  }

}]);
