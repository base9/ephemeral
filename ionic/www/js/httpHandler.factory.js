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

	httpObject.saveNewEvent = function(title, info, start, end, category, address, coords, userId) {
		console.log(title, info, start, end, category, userId);

		$http({
		  method: 'POST',
		  url: '/api/events',
		  data: {
		  	title: title,
		  	info: info,
		  	startTime: start,
		  	endTime: end,
		  	lat: coords.lat,
		  	lng: coords.lng,
		  	//category: category,
		  	user_id: userId
		  }
		})
		  .success(function(data, status) {
		  	console.log("posted new event")
		  })
		  .error(function(data, status) {
		    console.log("ERROR FOR API EVENTS");
		  });
	}

	

	return httpObject;
}]);