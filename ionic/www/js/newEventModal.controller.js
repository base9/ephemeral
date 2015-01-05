angular.module('radar')
.controller('NewEventWindowController', [
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