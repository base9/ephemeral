angular.module('radar')
.factory('MarkerFactory', function() {
  var markerObj = {};
  markers = [];

  markerObj.placeMarkers = function(map, events, http, callback) {
    // remove all existing markers
    markers = [];
    var bounds = new google.maps.LatLngBounds();

    if (events.length === 0) {
      return;
    }

    // for all existing markers
      // remove map from marker
      // 
    // create new markers for all events
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      var position = new google.maps.LatLng(event.lat, event.lng)

      // var image = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25)
      // };

      markers.push(new google.maps.Circle({
        map: map,
        title: event.title,
        // icon: image,
        position: position,
        strokeColor: 'green',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'green',
        fillOpacity: 0.35,
        center: position,
        radius: Math.random()*650
      }));

      bounds.extend(position);
    }
    map.fitBounds(bounds);

    if (events.length) {
      map.setZoom(14);
    }

    var ratings = event.ratings;

    callback(markers)
  }

  return markerObj;
})
