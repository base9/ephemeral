angular.module('radar')

.factory('MapFactory', function () {
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
  
    var styles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#81bb78"
            },
            {
                "lightness": "25"
            },
            {
                "saturation": "1"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "-7"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "saturation": "52"
            },
            {
                "color": "#ecf949"
            },
            {
                "lightness": "-20"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "44"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#5177af"
            },
            {
                "visibility": "on"
            }
        ]
    }
];

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
        currentLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        callback(pos.coords);
        map.setCenter(currentLocation);
        map.setZoom(14);

        mapObj.myMarker = new google.maps.Marker({
          position: currentLocation,
          map: map,
          icon: 'img/self_marker.png',
          content: 'You Are Here!'
        });
        
        watchId = navigator.geolocation.watchPosition(function() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(pos) {
              mapObj.myMarker.setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            })
          }
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
});
