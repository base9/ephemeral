var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  })
})

.factory('MapFactory', function () {
  var mapObj = {};

  var map;

  mapObj.initialize = function () {
    var mapOptions = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    return map = this.renderMap(mapOptions)
  }

  mapObj.renderMap = function (mapOptions) {
    return new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  mapObj.geoLocate = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

        mapObj.myMarker = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: map,
          content: 'You Are Here!'
        });
      }, function(err) {
        handleNoGeolocation(true);
      });
    } else {
      handleNoGeolocation(true);
    };    
  }

  mapObj.goToPlace = function(place) {
    this.myMarker.setPosition(place.geometry.location)
    
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(place.geometry.location);
    map.fitBounds(bounds);
    map.setZoom(12);
  }

  mapObj.handleNoGeolocation = function(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }

  return mapObj;
})

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

.factory('MarkerFactory', function() {
  var markerObj = {};
  var markers = [];

  markerObj.placeMarkers = function(map, places) {
    // remove all existing markers
    markers = [];
    var bounds = new google.maps.LatLngBounds();

    if (places.length === 0) {
      return;
    }

    // for all existing markers
      // remove map from marker
      // 

    // create new markers for all places
    for (var i = 0; i < places.length; i++) {
      var place = places[i];

      // var image = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25)
      // };

      markers.push(new google.maps.Marker({
        // FIXME: map is global 
        map: map,
        title: place.name,
        // icon: image,
        position: place.geometry.location
      }));

      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);

    if (places.length === 1) {
      map.setZoom(12);
    }
  }

  return markerObj;
})

.controller('MapController', ['MapFactory', 'MapSearchFactory', 'MarkerFactory', function(Map, SearchBox, Marker) {
  
  var map = Map.initialize();
  var myMarker = Map.geoLocate();

  SearchBox.initialize(map);

  this.goToPlace = function () {
    var places = SearchBox.searchBox.getPlaces();
    if (places.length) {
      Map.goToPlace(places[0])
    }
  }

  google.maps.event.addListener(SearchBox.searchBox, 'places_changed', this.goToPlace)

}])