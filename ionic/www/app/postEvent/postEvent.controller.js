angular.module('radar')
.controller('PostEventModalController', [
  'MapFactory', 
  'HttpHandler',
  'DateTimeFactory',
  'PhotoFactory',
  '$ionicModal',
  '$scope',
  '$rootScope',
  function(Map, Http, DateTime, Photo, $ionicModal, $scope, $rootScope) {

  	var startHours;
  	$scope.newPostData = {};
    $scope.newPostData.category = 'other';
    $scope.newPostData.price = 0;
  	$scope.dateTime = DateTime.getDateTime();
    $rootScope.photoUploaded = false;
  	getCurrentAddress();


  	function getCurrentAddress() {
  	  Map.findCurrentLocation(function(coords) {  
  	    var address = Http.reverseGeocode(coords.lat, coords.lng, function(address) {
  	      address = address.split(',');
  	      $scope.newPostData.streetAddress1 = address[0];
  	      $scope.newPostData.city = address[1].substring(1);
  	      $scope.newPostData.state = address[2].substring(1,3);
  	      $scope.$apply();
  	    });
  	  }); 
  	};

  	$scope.changeAMPM = function(startEnd) {
  	  $scope.dateTime[startEnd].ampm === "AM" ? $scope.dateTime[startEnd].ampm = "PM" : $scope.dateTime[startEnd].ampm = "AM";
  	}

  	$scope.changeEndHours = function() {
  	  startHours = parseInt($scope.dateTime.start.hours);
  	  $scope.dateTime.end.hours = DateTime.getTwelveHours(startHours+2);
  	  $scope.updateEndAMPM();
  	}

  	$scope.updateEndAMPM = function() {
  	  startHours = parseInt($scope.dateTime.start.hours);
  	  if (startHours >= 10) {  
  	    $scope.dateTime.start.ampm === "AM" ? $scope.dateTime.end.ampm = "PM" : $scope.dateTime.end.ampm = "AM";
  	  }
  	  if (startHours <= 9) {  
  	    $scope.dateTime.end.ampm = $scope.dateTime.start.ampm;
  	  }
  	}

  	$scope.changeEndMinutes = function() {
  	  $scope.dateTime.end.minutes = $scope.dateTime.start.minutes;
  	}

  	$scope.saveNewEvent = function() {
  	  $scope.newPostData.startTime = DateTime.combineDateTimeInputs($scope.dateTime, 'start');
  	  $scope.newPostData.endTime = DateTime.combineDateTimeInputs($scope.dateTime, 'end');
      for (var data in $scope.newPostData) { 
        if (!$scope.newPostData[data]) { $scope.newPostData[data] = ''; }
      }
      if (!$scope.newPostData.price) { $scope.newPostData.price = 0; }
  	  var address = ($scope.newPostData.streetAddress1+'+'+$scope.newPostData.city+'+'+$scope.newPostData.state).split(' ').join('+')

  	  Http.geocode(address, function(coords) {
  	    $scope.newPostData.lat = coords.lat;
  	    $scope.newPostData.lng = coords.lng;
  	    Http.saveNewEvent($scope.newPostData, function(res) {
  	      if($rootScope.photoUploaded){
  	        Photo.uploadPhotoToServer($scope.photoFile, res);
  	      } else {
  	        console.log('no photo attached, skipping photo upload protocol.')
  	      }
  	    });
  	  });
  	};

/*********** PHOTO UPLOAD/PREVIEW FUNCTIONS ********/

  	$scope.getFile = function() {
  	  Photo.getFile()
  	}

  	$scope.previewFile = function() {
      console.log("PREVIEWING PHOTO: ", Photo.previewFile())
  	  $scope.photoFile = Photo.previewFile()
      $rootScope.photoUploaded = true;
  	  $scope.$apply();
  	}

  	$scope.sub = function(obj) {
  	  Photo.sub(obj)
  	}
}]);