angular.module('radar')
.controller('MapController', [
  'MapFactory', 
  'MapSearchFactory', 
  'MarkerFactory', 
  'HttpHandler', 
  '$ionicModal',
  '$scope',
  '$rootScope', 
  function(Map, SearchBox, Marker, Http, $ionicModal, $scope, $rootScope) {

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

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    $scope.$on('modal.hidden', function() {
      $rootScope.inEvent = false;
    });
    $scope.$on('modal.removed', function() {
      $rootScope.inEvent = false;
    });

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
      console.log("LIST OF MARKERS: ", listOfEvents);

      Http.getEvents(listOfEvents.bounds, function(events) {
        events.sort(function(a,b) { return b.lat-a.lat; })
        createMarkers(events);
      });
    });

    var createMarkers = function(events) {
      Marker.placeMarkers(map, events, function(markers) {
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
                $rootScope.inEvent = true;
                $rootScope.photoUploaded = false;
                $rootScope.eventId = res.id;
                $scope.eventInfo = res;
                ($scope.eventInfo.price === "0.00") ? $scope.eventInfo.price = "Free" : $scope.eventInfo.price = '$'+ $scope.eventInfo.price;
                $scope.eventInfo.startDate = isoDateToTimeString(parseInt($scope.eventInfo.startTime));
                $scope.eventInfo.endDate = isoDateToTimeString(parseInt($scope.eventInfo.endTime));
                $scope.eventInfo.mainPhoto = $scope.eventInfo.photos[0] || 
                  {url: './img/thumbnails/' + $scope.eventInfo.category + '.jpg'};
                $scope.eventInfo.photos = $scope.eventInfo.photos.slice(1);
                $scope.eventInfo.comments = $scope.eventInfo.comments.reverse();
                if ($scope.eventInfo.city) { $scope.eventInfo.city += ',' }
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
    }
  
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
      if (this.filters.time.startTime && this.filters.time.endTime) {
        var today = new Date().setHours(0, 0, 0, 0);
        var offset = new Date().getTimezoneOffset() * 60000;
        console.log("TODAY: ", today, Date.parse(this.filters.time.startTime));
        this.filters.time.startTime = today + Date.parse(this.filters.time.startTime) - offset;
      }
      Marker.filterMarkers(map, listOfEvents, this.filters);

      this.filters = {distance: 0, popularity: 0, time: {now: false, startTime: null, endTime: null}, cost: 0, keyword: null};
    };

    this.show = false;

    this.showTime = function(show) {
      this.show = show;
    }

    google.maps.event.addListener(map, 'zoom_changed', function() {
      reloadToEventChange();
    });

    var timeoutID;
    google.maps.event.addListener(map, 'center_changed', function() {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(function() {
        reloadToEventChange();
      }, 200)
    });

    var reloadToEventChange = function() {
      var temp = map.getBounds();
      var bounds = {ne: temp.getNorthEast(), sw: temp.getSouthWest()};
      console.log("BOUNDS: ", bounds);
      Http.getEvents(bounds, function(events) {
        console.log("EVENTS IN LISTENER: ", events);
        events.sort(function(a,b) { return b.lat-a.lat; })
        createMarkers(events);
      });
    };

}]);
