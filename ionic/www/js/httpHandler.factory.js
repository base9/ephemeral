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

	httpObject.getAddressForCoords = function(lat, lng, callback) {
		$http.get('/api/events/reversegeocode?lat=' + lat + '&lng=' + lng)
		  .success(function(data, status) {
		 		callback(data);
		  })
		  .error(function(data, status) {
		    console.log("ERROR FOR API EVENTS");
		  });
	};

	httpObject.getCoordsForAddress = function(address, callback) {
		$http.get('/api/events/geocode?address=' + address)
		  .success(function(data, status) {
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
		  	category: postData.category,
		  	streetAddress1: postData.streetAddress1,
		  	streetAddress2: postData.streetAddress2,
		  	city: postData.city,
		  	state: postData.state,
		  	zipCode: postData.zipCode,
		  	user_id: postData.userId
		  }
		})
		  .success(function(data, status) {
		  	console.log("posted new event");
		  })
		  .error(function(data, status) {
		    console.log("ERROR FOR API EVENTS");
		  });
	};

	httpObject.postLogin = function (userData) {
    return $http({
      method: 'POST',
      url: '/auth/login',
      data: userData
    });
  };

  httpObject.postSignup = function (userData) {
    return $http({
      method: 'POST',
      url: '/auth/signup',
      data: userData
    });
  };

	return httpObject;
}]);