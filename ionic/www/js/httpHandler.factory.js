angular.module('starter')
.factory('HttpHandler', ['$http', function($http) {

	var httpObject = {};

	httpObject.getMarkers = function(callback) {
		//get all events
		$http.get('/api/events')
		  .success(function(data, status) {
		  	var tempTitle = data.map(function(element) {
		  		return element.title;
		  	});
		    var tempLocation = data.map(function(element) {
				//parse events to get positions
		      return new google.maps.LatLng(element.lat, element.lng);
		    });
			//pass into marker.factory.js
		    callback(tempTitle, tempLocation);
		  })
		  .error(function(data, status) {
		    console.log("ERROR FOR API EVENTS");
		  });
	}

	httpObject.getRatings = function() {
		$http.get('/api/ratings')
			.success(function(data, status) {
				var temp = data.map(function(element) {
					return [element.event_id, element.comment, element.star];
				})
				console.log("TEMP", temp);
			})
			.error(function(data, status) {
				console.log("ERROR FOR API RATINGS");
			});
	}

	return httpObject;
}]);