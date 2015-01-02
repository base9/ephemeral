angular.module('radar')
.controller('MenuController', function($scope, $ionicSideMenuDelegate, $ionicNavBarDelegate, $timeout, $ionicModal) {

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

/* MODALS */

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  }

	$scope.toggleRight = function() {
	  $ionicSideMenuDelegate.toggleRight();
	};
	
	$scope.login = function() {
			$ionicModal.fromTemplateUrl('../templates/login.html', {
		    scope: $scope,
		  }).then(function(modal) {
		    $scope.modal = modal;
				$scope.toggleRight();
				$scope.openModal();
		  });
	}


	$scope.register = function() {
		$scope.toggleRight();
		var modalInstance = $modal.open({
		  templateUrl: 'templates/register.html',
		  controller: 'ModalCtrl',
		});
		$ionicModal.fromTemplateUrl('../templates/register.html', {
	    scope: $scope,
	  }).then(function(modal) {
	    $scope.modal = modal;
			$scope.toggleRight();
			$scope.openModal();
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