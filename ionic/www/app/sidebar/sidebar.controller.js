angular.module('radar')
.controller('MenuController', [
  '$scope',
  '$rootScope',
  '$ionicSideMenuDelegate',
  '$ionicNavBarDelegate',
  '$timeout',
  '$ionicModal',
  'MapFactory', 
  'MarkerFactory', 
  'HttpHandler', 
  function($scope, $rootScope, $ionicSideMenuDelegate, $ionicNavBarDelegate, $timeout, $ionicModal, Map, Marker, Http) {

  $scope.showSearch = false;

// This is an ugly hack -- Figure out real angular/ionic ready function
  $timeout(function() {
    $ionicNavBarDelegate.handle = 'navBar';
    $ionicNavBarDelegate.title('Ephemeral');
  }, 150);

  $scope.loggedIn = false;

/* MODALS */

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
  
  $scope.login = function() {
    $ionicModal.fromTemplateUrl('app/modals/login.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.toggleRight();
      $scope.openModal();
    });
  };

  $scope.handleLogin = function(email, pwd) {
    if (!userData.email) {
      // logic for handling user errors goes here 
      return console.log('no email');
    }
    Http.postLogin({
      email: email,
      pwd: pwd
    }).success(function(data, status) {
      console.log('welcome back in');
      $scope.loggedInEmail = email;
      $scope.loggedIn = true;
      $scope.closeModal();
    }).error(function() {
      console.log('invalid username or password');
    });
  };

  $scope.register = function() {
    $ionicModal.fromTemplateUrl('app/modals/register.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.toggleRight();
      $scope.openModal();
    });
  };

  $scope.handleSignup = function(userEmail, userPassword, confirmPassword) {
    if (!(userEmail && userPassword && (userPassword === confirmPassword))) {
      // logic for handling user errors goes here 
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
      console.log('user already exists');
    });
  };

  $scope.newSearch = function() {
    $scope.search = '';
    $scope.showSearch = !$scope.showSearch;
  };

/************* NEW EVENT MODAL **************/

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

  $scope.openNewEventModal = function() {
    // TODO: Check for authentication. If authenticated, proceed. Else "Please Login or register to post events"
    $scope.newPostData = {
        title: '',
        info: '',
        streetAddress1: '',
        streetAddress2: '',
        city: '',
        state: '',
        category: '',
        price: 0,
      };

    getDateTime();
    getCurrentAddress()
    $rootScope.photoUploaded = false;

    $ionicModal.fromTemplateUrl('app/modals/newEventModal.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.toggleRight();
      $scope.openModal();
    });
  };

  function makeHash(len){
      var text = [];
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for(var i = 0; i < len; i++){
          text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
      }
      return text.join('');
  }

  function uploadPhotoToServer(file, eventId) {
    var photoFileName = makeHash(18) + '.jpg';
    Http.uploadPhoto(file, photoFileName, eventId);
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

  /************ EVENT INFO MODAL **************/
  $scope.liked = false;
  $scope.submitComment = function(comment) {
    Http.addComment({
      event_id: $rootScope.eventId,
      comment: comment
    }, function() {
      Http.getOneEvent($rootScope.eventId, function(eventInfo) {
      })
    })
  }

  $scope.updateRating = function(addSubtract) {
    console.log("UPDATING RATING...")
    Http.updateRating(addSubtract, $rootScope.eventId);
  }

/*************  Input type="file" Custom Functionality ************/

  $scope.getFile = function(){
      document.getElementById("upfile").click();
  }

  var preview;
  var file;
  var reader;
  $scope.previewFile = function() {
    preview = document.getElementsByClassName('photoPreview');
    preview = preview[preview.length-1];
    file = document.querySelector('input[type=file]').files[0];
    $scope.photoFile = file;
    reader = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
    }

    if (file) {
      $rootScope.photoUploaded = true;
      reader.readAsDataURL(file);
      if ($rootScope.inEvent) { uploadPhotoToServer(file, $rootScope.eventId) }
      $scope.$apply();
    } else {
      preview.src = "";
    }
  }

  $scope.sub = function(obj){
     var file = obj.value;
     var fileName = file.split("\\");
     document.getElementById("addPhotoButton").innerHTML = fileName[fileName.length-1];
     document.myForm.submit();
     event.preventDefault();
  }

}]);