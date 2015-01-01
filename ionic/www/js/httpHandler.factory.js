angular.module('radar')
.factory('HttpHandler', ['$http', function($http) {

	var httpObject = {};

	httpObject.getMarkers = function(callback) {
		//get all events
		$http.get('/api/events')
		  .success(function(data, status) {
		  	httpObject.events = data;
		 		callback(data);
		  })
		  .error(function(data, status) {
		    console.log("ERROR FOR API EVENTS");
		  });
	}

	// httpObject.getRatings = function(callback) {
	// 	$http.get('/api/ratings')
	// 		.success(function(data, status) {
	// 			var temp = data.map(function(element) {
	// 				return {eventID: element.event_id, comment: element.comment, stars: element.stars};
	// 			})
	// 			// console.log("TEMP", temp);
	// 			// console.log("CALLBACK", callback);
	// 			callback(temp);
	// 		})
	// 		.error(function(data, status) {
	// 			console.log("ERROR FOR API RATINGS");
	// 		});
	// }

	return httpObject;
}]);