angular.module('radar')

.filter('cost', function() {
  return function(input) {
    if (input === '100') {
      return input + '+';
    } else if (input === '0') {
      return 'FREE';
    } else {
      return input;
    }
  }
})

.controller('MapController', [
  'SharedProperties',
  'MapFactory', 
  'MarkerFactory', 
  'HttpHandler', 
  '$ionicModal',
  '$scope',
  function(Shared, Map, Marker, Http, $ionicModal, $scope) {
    $scope.isLoaded = false;

    var listOfEvents = {};
    $scope.eventInfo = {};
    var timeoutID;
  
    $scope.geoLocate = function(){
      Map.geoCenter();
    };

    var map = Map.initialize();

    this.activateDistance = false;
    this.activatePopularity = false;
    this.activateCost = false;
    this.showCategory = false;
    this.toggleDistance = function() {
      this.activateDistance = !this.activateDistance;
    };
    this.togglePopularity = function() {
      this.activatePopularity = !this.activatePopularity;
    };
    this.toggleCost = function() {
      this.activateCost = !this.activateCost;
    };
    this.toggleCategory = function() {
      this.showCategory = !this.showCategory;
    };

    //Allows the specify time filter to be shown
    this.show = false;
    this.triggerNow = false;
    this.showTime = function(show) {
      this.show = show;
      this.triggerNow = true;
    };

    var categories = {'culture': false, 'fitness': false, 'entertainment': false, 'hobbies': false, 'drink': false, 'other': false};
    this.addCategory = function(str) {
      categories[str] = !categories[str];
      console.log("CATEGORY LIST: ", categories);
    };
  
    //Creates filters to be passed into event filter
    this.filters = {distance: 1, popularity: 1, category: null, time: {now: false, startTime: null, endTime: null}, cost: 50, keyword: null};

    this.filter = function() {
      console.log("BEFORE FILTERS", this.filters);
      if (!this.show && this.triggerNow) {
        this.filters.time.now = true;
      }
      if (!this.activateDistance) {
        this.filters.distance = null;
      }
      if (!this.activatePopularity) {
        this.filters.popularity = null;
      }
      if (!this.activateCost) {
        this.filters.cost = null;
      }
      if (this.filters.time.startTime && this.filters.time.endTime) {
        var today = new Date().setHours(0, 0, 0, 0);
        var offset = new Date().getTimezoneOffset() * 60000;
        this.filters.time.startTime = new Date(today + Date.parse(this.filters.time.startTime) - offset);
        this.filters.time.endTime = new Date(today + Date.parse(this.filters.time.endTime) - offset);
      }
      checkCategories(this);
      console.log("AFTER FILTERS", this.filters);
      Marker.filterMarkers(map, listOfEvents, this.filters);

    };

    this.reset = function() {
      this.filters = {distance: 1, popularity: 1, category: null, time: {now: false, startTime: null, endTime: null}, cost: 50, keyword: null};
    }

    function checkCategories(context) {
      console.log("NOT BROKEN HERE", this.filters);
      var result = [];
      for (var key in categories) {
        if (categories[key]) {
          result.push(key);
        }
      }
      context.filters.category = result;
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
        listOfEvents.events = events;
        for (var i = 0; i < markers.length; i++) {
          var title = events[i].title;
          var marker = markers[i];
          var event = events[i];
          //must invoke function in order to grab current marker, title, and rating
          google.maps.event.addListener(marker, 'click', (function(marker, event) {
            return function() {
              Http.getOneEvent(event.id, function(res) {
                Shared.setEvent(res);
                Shared.setInEvent(true);
                $ionicModal.fromTemplateUrl('./app/eventInfo/eventInfo.html', {
                  scope: $scope,
                })
                .then(function(modal) {
                  $scope.modal = modal;
                  $scope.openModal();
                });
              });
            };
          })(marker, event));
        }
        // $scope.isLoaded = true;
        // $scope.fade = 'fade';
      });
    }

    google.maps.event.addListener(map, 'zoom_changed', function() {
      reloadToEventChange();
    });

    google.maps.event.addListener(map, 'center_changed', function() {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(function() {
        reloadToEventChange();
      }, 200);
    });

    var reloadToEventChange = function() {
      var temp = map.getBounds();
      var bounds = {ne: temp.getNorthEast(), sw: temp.getSouthWest()};
      console.log("BOUNDS: ", bounds);
      Http.getEvents(bounds, function(events) {
        console.log("EVENTS IN LISTENER: ", events);
        events.sort(function(a,b) { return b.lat-a.lat; });
        createMarkers(events);
      });
    };

/******************* MODAL FUNCTIONS *******************/

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
      Shared.setInEvent(false);
    });
    $scope.$on('modal.removed', function() {
      Shared.setInEvent(false);
    });

}]);
