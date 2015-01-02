angular.module('radar')
.controller('EventWindowController', [
	'MapFactory', 
	'MarkerFactory', 
	'HttpHandler', 
	'$scope', 
	function(Map, Marker, Http, $scope) {

		$scope.saveNewEvent = function() {
			console.log("SAVING NEW EVENT");
		}

		$scope.test = "HELLO";


}])