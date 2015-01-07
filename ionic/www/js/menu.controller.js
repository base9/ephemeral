angular.module('radar')
.controller('MenuController', [
	'$scope',
	'$ionicSideMenuDelegate',
	'$ionicNavBarDelegate',
	'$timeout',
	'$ionicModal',
	'MapFactory', 
	'MarkerFactory', 
	'HttpHandler', 
	'$scope', 
	function($scope, $ionicSideMenuDelegate, $ionicNavBarDelegate, $timeout, $ionicModal, Map, Marker, Http) {


	$scope.showSearch = false;

// FILTER MENU
	$scope.toggleFilter = false;
	$scope.partyCheck = true;
	$scope.concertCheck = true;
	$scope.happyHourCheck = true;

// This is an ugly hack -- Figure out real angular/ionic ready function
	$timeout(function() {
		$ionicNavBarDelegate.handle = 'navBar';
		$ionicNavBarDelegate.title('Ephemeral');
	}, 150);

	// $scope.test = function() {
	// 	console.log("seearchtext")
	// }
	$scope.loggedIn = false;

/* MODALS */

	$scope.test = "HELLO"

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

	$scope.handleLogin = function(email, pwd) {
		Http.postLogin({
			email: email,
			pwd: pwd
		}).success(function(data, status) {
			console.log('welcome back in')
			$scope.loggedInEmail = email;
			$scope.loggedIn = true;
			$scope.closeModal();
		}).error(function() {
			console.log('invalid username or password')
		})
	}

	$scope.register = function() {
		$ionicModal.fromTemplateUrl('../templates/register.html', {
	    scope: $scope,
	  }).then(function(modal) {
	    $scope.modal = modal;
			$scope.toggleRight();
			$scope.openModal();
	  });
	};

	$scope.handleSignup = function(userEmail, userPassword, confirmPassword) {
		if (!(userEmail && userPassword && (userPassword === confirmPassword))) {
			return console.log('either (invalid email or password) or (passwords don\'t match)');
		}
		Http.postSignup({
			email: userEmail,
			pwd: userPassword
		}).success(function(data, status) {
			console.log('welcome to the cluuub');
			$scope.loggedInEmail = userEmail;
			$scope.loggedIn = true;
			$scope.closeModal();
		}).error(function(data, status) {
			console.log('user already exists')
		})
	}

	$scope.newSearch = function() {
		$scope.search = ''
		$scope.showSearch = !$scope.showSearch;
	};

	/* NEW EVENT MODAL */

	

	$scope.getCurrentAddress = function() {
		console.log("getting address")
		Map.findCurrentLocation(function(coords) {	
			var address = Http.getAddressForCoords(coords.lat, coords.lng, function(address) {
				console.log(address);
				$scope.newPostData.streetAddress1 = address.streetAddress1;
				$scope.newPostData.city = address.city;
				$scope.newPostData.state = address.state;
				$scope.newPostData.zipCode = address.zipCode;
			})
		}) // TODO: Promisify
	}

	$scope.postNewEvent = function() {
		// TODO: Check for authentication. If authenticated, proceed. Else "Please Login or register to post events"
		$scope.newPostData = {
				title: '',
				info: '',
				streetAddress1: '',
				streetAddress2: '',
				city: '',
				state: '',
				zipCode: '',
				startDateTime: new Date(),
				endDateTime: '',
				category: '',
				coords: {lat: undefined, lng: undefined}
			};
		$ionicModal.fromTemplateUrl('../templates/newEventModal.html', {
	    scope: $scope,
	  }).then(function(modal) {
	    $scope.modal = modal;
			$scope.toggleRight();
			$scope.openModal();
	  });
	};

	$scope.saveNewEvent = function() {
		// TODO: Get userId from Auth, pass it into http call below
		var userId = 1
		// DUMMY INFO BELOW
		var address = ($scope.newPostData.streetAddress1+'+'+$scope.newPostData.streetAddress2+'+'+$scope.newPostData.city+'+'+$scope.newPostData.state+'+'+$scope.newPostData.zipCode).split(' ').join('+')
		Http.getCoordsForAddress(address, function(coords) {
			$scope.newPostData.coords = coords;
			Http.saveNewEvent($scope.newPostData);
		})
	}

	$scope.startDateTime = new Date();
	$scope.endDateTime

}])

// angular.module('radar').controller('ModalCtrl', function ($scope, $modalInstance) {

//   $scope.ok = function () {
//     $modalInstance.close();
//   };

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };

// });