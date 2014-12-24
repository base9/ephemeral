angular.module('starter')
.factory('MarkerFactory', function() {
  var markerObj = {};
  var markers = [];

  markerObj.placeMarkers = function(map, title, places, http) {
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

    var ratings;
    http.getRatings(function(element) {
      ratings = element;
    });

    setTimeout(function() {
      addListener(map, title, ratings)
    }, 100);
  }


  var addListener = function(map, titles, ratings) {
    console.log("RATINGS LIST", ratings);
    //marker[i] should match to title[i]
    for (var i = 0; i < markers.length; i++) {
      //grab ratings according to event_id
      var rating = '';
      for (var j = 0; j < ratings.length; j++) {
        if (ratings[j].eventID === (i + 1)) {
          rating += '<div><h6>' + ratings[j].stars + '</h6>' + '<p>' + ratings[j].comment + '</p></div>';
        }
      };
      console.log("RATING", rating);
      var infowindow = new google.maps.InfoWindow();
      var marker = markers[i];
      var title = titles[i];
      console.log("ADD LISTENER", title);

      google.maps.event.addListener(marker, 'click', (function(marker, title, rating) {
        return function() {
          infowindow.setContent('<h4>' + title + '</h4>' + rating);
          infowindow.open(map, marker);
        }
      })(marker, title, rating));
    };
  }

  return markerObj;
})
