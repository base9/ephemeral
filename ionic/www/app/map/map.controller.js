angular.module('radar')
.controller('MapController', [
  'MapFactory', 
  'MapSearchFactory', 
  'MarkerFactory', 
  'HttpHandler', 
  '$ionicModal',
  '$scope', 
  function(Map, SearchBox, Marker, Http, $ionicModal, $scope) {

    var listOfEvents = {};
    $scope.eventInfo = {};
  
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

    $scope.closeModalAndGetDirections = function () {
      var event;
      if (event = $scope.eventInfo) {
        var pos = {
          lat: event.lat,
          lng: event.lng
        };
        Map.getDirections(pos);
        $scope.closeModal();
      }
    }

    Map.geoLocate(function(location, bounds) {
      listOfEvents.location = {'lat': location.latitude, 'lng': location.longitude};
      listOfEvents.bounds = {ne: bounds.getNorthEast(), sw: bounds.getSouthWest()};
      console.log("BOUNDS: ", listOfEvents.bounds);
      console.log("LIST OF MARKERS: ", listOfEvents);

      Http.getMarkers(listOfEvents.bounds, function(events) {
        Marker.placeMarkers(map, events, function(markers) {
          console.log("EVENTS: ", events);
          //store marker location and events inside scope for now
          listOfEvents.events = events;
          for (var i = 0; i < markers.length; i++) {
            var title = events[i].title;
            var marker = markers[i];
            var event = events[i];
            //must invoke function in order to grab current marker, title, and rating
            google.maps.event.addListener(marker, 'click', (function(marker, event) {
              return function() {
                Http.getOneEvent(event.id, function(res) {
                  $scope.eventInfo = res;
                  ($scope.eventInfo.price === "0.00") ? $scope.eventInfo.price = "Free" : $scope.eventInfo.price = '$'+ $scope.eventInfo.price;
                  $scope.eventInfo.startDate = isoDateToTimeString(parseInt($scope.eventInfo.startTime));
                  $scope.eventInfo.endDate = isoDateToTimeString(parseInt($scope.eventInfo.endTime));
                  $scope.eventInfo.mainPhoto = $scope.eventInfo.photos[0];
                  $scope.eventInfo.photos = $scope.eventInfo.photos.slice(1);
                  $scope.eventInfo.comments = $scope.eventInfo.comments.reverse();
                });
                $ionicModal.fromTemplateUrl('./app/modals/eventInfoModal.html', {
                  scope: $scope,
                })
                .then(function(modal) {
                  $scope.modal = modal;
                  $scope.openModal();
                });
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
    Marker.filterMarkers(map, listOfEvents, this.filters);

    this.filters = {distance: 0, popularity: 0, time: {now: false, startTime: null, endTime: null}, cost: 0, keyword: null};
  };

  this.show = false;

  this.showTime = function(show) {
    this.show = show;
  }

}]);
