angular.module('radar')

.factory('MapFactory', ['MapStyle', function(MapStyle) {
  var mapObj = {};

  var map;
  var watchId;
  var currentLocation;
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();

  mapObj.initialize = function() {
  
    var mapOptions = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
  
    var styledMap = new google.maps.StyledMapType(MapStyle, {name: "Styled Map"});

    map = this.renderMap(mapOptions);
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    return map;
  };

  mapObj.renderMap = function (mapOptions) {
    return new google.maps.Map(document.getElementById('map'), mapOptions);
  };

  mapObj.findCurrentLocation = function(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        callback({lat: pos.coords.latitude, lng: pos.coords.longitude});
      });
    } else {
      handleNoGeolocation(true);
    }
  };

  mapObj.geoLocate = function(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        currentLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        map.setCenter(currentLocation);
        var bounds = map.getBounds();
        callback(pos.coords, bounds);

        mapObj.myMarker = new google.maps.Marker({
          position: currentLocation,
          map: map,
          icon: 'img/self_marker.png',
          content: 'You Are Here!'
        });
        
      }, function(err) {
        handleNoGeolocation(true);
      });

    } else {
      handleNoGeolocation(true);
    }
  };

  mapObj.getDirections = function (event) {
    if (currentLocation) {
      var request = {
        origin: currentLocation,
        destination: new google.maps.LatLng(event.lat, event.lng),
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setMap(map);
          directionsDisplay.setOptions( { suppressMarkers: true } );
          directionsDisplay.setDirections(result);
        }
      })
    }
  }

  mapObj.geoCenter = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      });
    }
  };

  mapObj.goToPlace = function(place) {
    this.myMarker.setPosition(place.geometry.location);
    
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(place.geometry.location);
    map.fitBounds(bounds);
    map.setZoom(12);
  };

  var handleNoGeolocation = function(errorFlag) {
    var content;
    if (errorFlag) {
      content = 'Error: The Geolocation service failed.';
    } else {
      content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105), //default to IP address
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  };

  return mapObj;
}]);
