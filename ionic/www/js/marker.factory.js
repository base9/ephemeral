angular.module('starter')
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
        map: map,
        // title: place.name,
        // icon: image,
        position: place
      }));

      bounds.extend(place);
    }
    map.fitBounds(bounds);

    if (places.length) {
      map.setZoom(14);
    }
  }

  markerObj.addListener = function(marker) {
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i];
      google.maps.event.addListener(marker, 'click', function() {
        console.log("LISTENING TO MARKER: ", marker);
      });
    };
  }

  return markerObj;
})
