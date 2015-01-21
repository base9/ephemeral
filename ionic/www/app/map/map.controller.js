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
  };
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

    var vm = this;
  
    $scope.geoLocate = function(){
      Map.geoCenter();
    };

    var map = Map.initialize();

    vm.activateDistance = false;
    vm.activatePopularity = false;
    vm.activateCost = false;
    vm.showCategory = false;
    vm.toggleDistance = function() {
      vm.activateDistance = !vm.activateDistance;
    };
    vm.togglePopularity = function() {
      vm.activatePopularity = !vm.activatePopularity;
    };
    vm.toggleCost = function() {
      vm.activateCost = !vm.activateCost;
    };
    vm.toggleCategory = function() {
      vm.showCategory = !vm.showCategory;
    };

    //Allows the specify time filter to be shown
    vm.show = false;
    vm.triggerNow = false;
    vm.showTime = function(show) {
      vm.show = show;
      vm.triggerNow = true;
    };

    var categories = {'culture': false, 'fitness': false, 'entertainment': false, 'hobbies': false, 'drink': false, 'other': false};
    vm.addCategory = function(str) {
      categories[str] = !categories[str];
      console.log("CATEGORY LIST: ", categories);
    };
  
    //Creates filters to be passed into event filter
    vm.filters = {distance: null, popularity: null, category: null, time: {now: false, startTime: null, endTime: null}, cost: null, keyword: null};

    vm.filter = function() {
      console.log("BEFORE FILTERS", vm.filters);
      if (!vm.show && vm.triggerNow) {
        vm.filters.time.now = true;
      }
      if (!vm.activateDistance) {
        vm.filters.distance = null;
      }
      if (!vm.activatePopularity) {
        vm.filters.popularity = null;
      }
      if (!vm.activateCost) {
        vm.filters.cost = null;
      }
      if (vm.filters.time.startTime && vm.filters.time.endTime) {
        var today = new Date().setHours(0, 0, 0, 0);
        var offset = new Date().getTimezoneOffset() * 60000;
        vm.filters.time.startTime = new Date(today + Date.parse(vm.filters.time.startTime) - offset);
        vm.filters.time.endTime = new Date(today + Date.parse(vm.filters.time.endTime) - offset);
      }
      checkCategories();
      console.log("AFTER FILTERS", vm.filters);
      Marker.filterMarkers(map, listOfEvents, vm.filters);

    };

    vm.reset = function() {
      vm.filters = {distance: null, popularity: null, category: null, time: {now: false, startTime: null, endTime: null}, cost: null, keyword: null};
      categories = {'culture': false, 'fitness': false, 'entertainment': false, 'hobbies': false, 'drink': false, 'other': false};
      console.log("RESET FILTERS: ", vm.filters);
    };

    function checkCategories() {
      var result = [];
      for (var key in categories) {
        if (categories[key]) {
          result.push(key);
        }
      }
      vm.filters.category = result;
    }

    Map.geoLocate(function(location, bounds) {
      listOfEvents.location = {'lat': location.latitude, 'lng': location.longitude};
      listOfEvents.bounds = {ne: bounds.getNorthEast(), sw: bounds.getSouthWest()};
      console.log("LIST OF MARKERS: ", listOfEvents);

      Http.getEvents(listOfEvents.bounds, function(events) {
        events.sort(function(a,b) { return b.lat-a.lat; });
        createMarkers(events);
      });
    });

    var createMarkers = function(events) {
      if (events.length === 0) {
        setTimeout(function() {$scope.isLoaded = true;}, 3.9); 
        $scope.fade = 'fade';
      } else {
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
          setTimeout(function() {$scope.isLoaded = true;}, 3.9); 
          $scope.fade = 'fade';
        });
      }
    };

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
        vm.filter();
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
