angular.module('starter')
.controller('MenuController', function($scope, $ionicSideMenuDelegate, $ionicNavBarDelegate, $timeout) {
	$scope.toggleRight = function() {
	  $ionicSideMenuDelegate.toggleRight();
	};

	$scope.showSearch = false;

// This is an ugly hack -- Figure out real angular/ionic ready function
	$timeout(function() {
		$ionicNavBarDelegate.handle = 'navBar';
		$ionicNavBarDelegate.title('Playdar!');
	}, 150);

	$scope.test = function() {
		console.log("seearchtext")
	}


	$scope.newSearch = function() {
		$scope.search = ''
		$scope.showSearch = !$scope.showSearch;
	}

})