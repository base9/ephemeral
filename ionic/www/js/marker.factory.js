angular.module('radar')
.factory('MarkerFactory', function() {
  var markerObj = {};
  markers = [];

  markerObj.placeMarkers = function(map, events, http) {
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
        map: map,
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

    addListener(map, events, markers)
  }


  var addListener = function(map, events, markers) {
    for (var i = 0; i < markers.length; i++) {
      var rating = '';
      events[i].rating.forEach(function(rated) {
        rating += '<div><h6>' + rated.stars + '</h6>' + '<p>' + rated.comment + '</p></div>';
      })
      var infowindow = new google.maps.InfoWindow(
        
        );
      var title = events[i].title;
      var marker = markers[i];
      //must invoke function in order to grab current marker, title, and rating
      google.maps.event.addListener(marker, 'click', (function(marker, title, rating) {
        return function() {
          infowindow.setContent('<div class="infoWindow"><h4>' + title + '</h4>' + rating + '</div>');
          infowindow.open(map, marker);
        }
      })(marker, title, rating));
    };
  };
  return markerObj;
})
