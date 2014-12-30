angular.module('starter')
.controller('MenuController', function($scope, $ionicSideMenuDelegate,$ionicNavBarDelegate) {
	$scope.toggleRight = function() {
	   $ionicSideMenuDelegate.toggleRight();
	 };
})