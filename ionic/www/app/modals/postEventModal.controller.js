angular.module('radar')
.controller('PostEventModalController', [
  'MapFactory', 
  'MapSearchFactory', 
  'MarkerFactory', 
  'HttpHandler', 
  '$ionicModal',
  '$scope',
  '$rootScope', 
  function(Map, SearchBox, Marker, Http, $ionicModal, $scope, $rootScope) {

  	function getCurrentAddress() {
  	  Map.findCurrentLocation(function(coords) {  
  	    var address = Http.getAddressForCoords(coords.lat, coords.lng, function(address) {
  	      address = address.split(',');
  	      $scope.newPostData.streetAddress1 = address[0];
  	      $scope.newPostData.city = address[1].substring(1);
  	      $scope.newPostData.state = address[2].substring(1,3);
  	      $scope.$apply();
  	    });
  	  }); 
  	};

  	var ampm;
  	function getAMPM(hours) {
  	  (hours > -1 && hours < 12) ? ampm = "AM" : ampm = "PM";
  	  return ampm;
  	}

  	function getTwelveHours(hours) {
  	  if (hours > 12 || hours === 0) {
  	    hours = Math.abs(hours-12)
  	  }
  	  return hours;
  	}

  	function getDateTime() {
  	  var startDate = new Date();
  	  var endDate = new Date();
  	  endDate.setHours(endDate.getHours()+2);

  	  var startAMPM = getAMPM(startDate.getHours());
  	  var endAMPM = getAMPM(endDate.getHours());
  	  
  	  $scope.dateTime = {
  	    start: {
  	      month: startDate.getMonth(),
  	      day: startDate.getDate(),
  	      hours: getTwelveHours(startDate.getHours()),
  	      minutes: Math.floor(startDate.getMinutes()/15)*15,
  	      ampm: startAMPM,
  	      year: 2015,
  	    },
  	    end: {
  	      month: endDate.getMonth(),
  	      day: endDate.getDate(),
  	      hours: getTwelveHours(endDate.getHours()),
  	      minutes: Math.floor(startDate.getMinutes()/15)*15,
  	      ampm: endAMPM,
  	      year: 2015
  	    }
  	  };   
  	}

  	function combineDateTimeInputs(startEnd) {
  	  var time = new Date();
  	  time.setHours(get24Hours($scope.dateTime[startEnd].hours, $scope.dateTime[startEnd].ampm));
  	  time.setMinutes($scope.dateTime[startEnd].minutes);
  	  time.setDate($scope.dateTime[startEnd].day);
  	  time.setMonth($scope.dateTime[startEnd].month);
  	  time.setYear($scope.dateTime[startEnd].year);

  	  return Date.parse(time);
  	}

  	function get24Hours(hours, ampm) {
  	  if (ampm === "AM" && hours === "12") { return 0 };
  	  return (ampm === "AM") ? hours : hours + 12;
  	}

  	$scope.changeAMPM = function(startEnd) {
  	  $scope.dateTime[startEnd].ampm === "AM" ? $scope.dateTime[startEnd].ampm = "PM" : $scope.dateTime[startEnd].ampm = "AM";
  	}

  	var startHours;

  	$scope.changeEndHours = function() {
  	  startHours = parseInt($scope.dateTime.start.hours);
  	  $scope.dateTime.end.hours = getTwelveHours(startHours+2);
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
  	  $scope.newPostData.startTime = combineDateTimeInputs('start');
  	  $scope.newPostData.endTime = combineDateTimeInputs('end');
  	  var address = ($scope.newPostData.streetAddress1+'+'+$scope.newPostData.city+'+'+$scope.newPostData.state).split(' ').join('+')

  	  Http.getCoordsForAddress(address, function(coords) {
  	    $scope.newPostData.lat = coords.lat;
  	    $scope.newPostData.lng = coords.lng;
  	    Http.saveNewEvent($scope.newPostData, function(res) {
  	      // $ionicModal.fromTemplateUrl('app/modals/postSuccess.html', {
  	      // scope: $scope,
  	      // }).then(function(modal) {
  	      //   $scope.modal = modal;
  	      //   $scope.openModal();
  	      // });
  	      console.log("EVENT ID?: ", res)
  	      if($rootScope.photoUploaded){
  	        uploadPhotoToServer($scope.photoFile, res);
  	      } else {
  	        console.log('no photo attached, skipping photo upload protocol.')
  	      }
  	    });
  	  });
  	};
}]);