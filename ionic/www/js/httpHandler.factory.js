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

	httpObject.saveNewEvent = function(title, info, streetAddress1, streetAddress2, city, state, zipCode, startDateTime, endDateTime, category, coords, userId) {
		console.log(title, info, streetAddress1, streetAddress2, city, state, zipCode, startDateTime, endDateTime, category, coords, userId);

		$http({
		  method: 'POST',
		  url: '/api/events',
		  data: {
		  	title: title,
		  	info: info,
		  	startTime: startDateTime,
		  	endTime: endDateTime,
		  	lat: coords.lat,
		  	lng: coords.lng,
		  	//category: category,
		  	//streetAddress1: streetAddress1,
		  	//streetAddress2: streetAddress2,
		  	//city: city,
		  	//state: state,
		  	//zipCode: zipCode,
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