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
	};

	httpObject.saveNewEvent = function(postData) {
		console.log(postData);
		$http({
		  method: 'POST',
		  url: '/api/events',
		  data: {
		  	title: postData.title,
		  	info: postData.info,
		  	startTime: postData.startDateTime,
		  	endTime: postData.endDateTime,
		  	lat: postData.coords.lat,
		  	lng: postData.coords.lng,
		  	// TODO: Uncomment these fields after preparing schema and gmapsAPI call for address
		  	//category: postData.category,
		  	//streetAddress1: postData.streetAddress1,
		  	//streetAddress2: postData.streetAddress2,
		  	//city: postData.city,
		  	//state: postData.state,
		  	//zipCode: postData.zipCode,
		  	user_id: postData.userId
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