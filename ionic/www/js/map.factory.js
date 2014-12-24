angular.module('starter')
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

  var handleNoGeolocation = function(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105), //default to IP address
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }

  return mapObj;
})
