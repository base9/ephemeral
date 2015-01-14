angular.module('radar')

.factory('MapFactory', function () {
  var mapObj = {};

  var map;
  var watchId;

  mapObj.initialize = function() {
  
    function placeMarker(position) {

      var marker = new google.maps.Circle({
        map: map,
        title: event.title,
        position: position,
        strokeColor: 'green',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'green',
        fillOpacity: 0.35,
        center: position,
        radius: 20
      });
      
      newEventWindow.open(map, marker);


    }
    var mapOptions = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
  
    var styles = [
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f7f1df"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#d0e3b4"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbd3da"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#bde6ab"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffe15f"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#efd151"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }, 
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "black"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#cfb2db"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a2daf2"
            }
        ]
    }];

    var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

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
        var currentLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        map.setCenter(currentLocation);
        map.setZoom(14);
        var bounds = map.getBounds();
        console.log("BOUNDS IN MAP FACTORY", bounds);
        callback(pos.coords, bounds);

        mapObj.myMarker = new google.maps.Marker({
          position: currentLocation,
          map: map,
          icon: 'img/self_marker.png',
          content: 'You Are Here!'
        });
        
        // watchId = navigator.geolocation.watchPosition(function() {
        //   if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(function(pos) {
        //       mapObj.myMarker.setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        //     })
        //   }
        // });

      }, function(err) {
        handleNoGeolocation(true);
      });

    } else {
      handleNoGeolocation(true);
    }
  };

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
});
