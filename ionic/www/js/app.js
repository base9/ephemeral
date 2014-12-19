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

.controller('MapController', function($scope, $ionicLoading) {
	var map;
	$scope.mapLoaded = true;

	google.maps.event.addDomListener(window, 'load', function() {
		var mapOptions = {
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById('map'), mapOptions);

		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(pos) {
				map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
				var myLocation = new google.maps.Marker({
					position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
					map: map,
					title: 'You Are Here!'
				})
			}, function(err) {
				handleNoGeolocation(true);
			});
		} else {
			handleNoGeolocation(true);
		};

		var input = (document.getElementById('pac-input'));
		// Positions the search box to the top left corner
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		var searchBox = new google.maps.places.SearchBox(input);
	})

	function handleNoGeolocation(errorFlag) {
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

//////////// SEARCH BOX //////////////////
  var markers = [];
  // Create the search box and link it to the UI element.
  //Location in the HTML to where the search box will be placed
  var input = (document.getElementById('pac-input'));
  //Positions the search box to the top left corner
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var searchBox = new google.maps.places.SearchBox(input);

  //Listens to changes when user submits in a location
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    //Returns the query selected by the user, or null if no places have been found
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    markers = [];
    // For each place, get the icon, place name, and location.
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      console.log("INFO: ", image);

      // Create a marker for each place
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });

	$scope.map = map;

})