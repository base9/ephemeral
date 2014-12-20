angular.module('starter')
.factory('HttpHandler', ['$http', function($http) {

	var httpObject = {};

	httpObject.getMarkers = function(callback) {
		//get all events
		$http.get('/api/events')
		  .success(function(data, status) {
		    var temp = data.map(function(element) {
				//parse events to get positions
		      return new google.maps.LatLng(element.lat, element.lng);
		    })
			//pass into marker.factory.js
		    callback(temp);
		  })
		  .error(function(data, status) {
		    console.log("ERROR FOR API EVENTS");
		  });
	}

	return httpObject;
}]);