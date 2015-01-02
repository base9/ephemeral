angular.module('radar')
.controller('MenuController', function($scope, $ionicSideMenuDelegate, $ionicNavBarDelegate, $timeout, $modal) {
	$scope.toggleRight = function() {
	  $ionicSideMenuDelegate.toggleRight();
	};


	$scope.showSearch = false;

// FILTER MENU
	$scope.toggleFilter = false;
	$scope.partyCheck = true;
	$scope.concertCheck = true;
	$scope.happyHourCheck = true;
	$scope.startTime = Date.now()

// This is an ugly hack -- Figure out real angular/ionic ready function
	$timeout(function() {
		$ionicNavBarDelegate.handle = 'navBar';
		$ionicNavBarDelegate.title('Playdar!');
	}, 150);

	// $scope.test = function() {
	// 	console.log("seearchtext")
	// }
	$scope.loggedIn = false;

	$scope.login = function() {
		$scope.toggleRight();
		var modalInstance = $modal.open({
		  templateUrl: 'templates/login.html',
		  controller: 'ModalCtrl',
		  // size: size,
		  // resolve: {
		  //   items: function () {
		  //     return $scope.items;
		  //   }
		  // }
		});

		// modalInstance.result.then(function (selectedItem) {
  //     $scope.selected = selectedItem;
  //   }, function () {
  //     $log.info('Modal dismissed at: ' + new Date());
  //   });
	}

	$scope.register = function() {
		$scope.toggleRight();
		var modalInstance = $modal.open({
		  templateUrl: 'templates/register.html',
		  controller: 'ModalCtrl',
		});	
	};

	$scope.newSearch = function() {
		$scope.search = ''
		$scope.showSearch = !$scope.showSearch;
	};



})

angular.module('radar').controller('ModalCtrl', function ($scope, $modalInstance) {


  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});