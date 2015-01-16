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
    console.log("Getting address...");
    Map.findCurrentLocation(function(coords) {  
      var address = Http.getAddressForCoords(coords.lat, coords.lng, function(address) {
        address = address.split(',');
        $scope.newPostData.streetAddress1 = address[0];
        $scope.newPostData.city = address[1];
        $scope.newPostData.state = address[2].substring(1,3);
        $scope.$apply();
      });
    }); 
  };

  // HOPEFULLY REMOVE THIS FUNCTION
  var AMPM;
  function getAMPM(hours) {
    (hours > -1 && hours < 12) ? AMPM = "AM" : AMPM = "PM";
    return AMPM;
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
      startMonth: startDate.getMonth(),
      startDay: startDate.getDay(),
      startHours: getTwelveHours(startDate.getHours()),
      startMinutes: Math.floor(startDate.getMinutes()/15)*15,
      startAMPM: startAMPM,
      startYear: 2015,
      endMonth: endDate.getMonth(),
      endDay: endDate.getDay(),
      endHours: getTwelveHours(endDate.getHours()),
      endMinutes: Math.floor(startDate.getMinutes()/15)*15,
      endAMPM: endAMPM,
      endYear: 2015
    };   

    console.log($scope.dateTime);
  }
  
  $scope.changeAMPM = function(startEnd) {
    $scope.dateTime[startEnd] === "AM" ? $scope.dateTime[startEnd] = "PM" : $scope.dateTime[startEnd] = "AM";
  }

  var startHours;

  $scope.changeEndHours = function() {
    startHours = parseInt($scope.dateTime.startHours);
    $scope.dateTime.endHours = getTwelveHours(startHours+2);
    $scope.updateEndAMPM();
  }

  $scope.updateEndAMPM = function() {
    startHours = parseInt($scope.dateTime.startHours);
    console.log("UPDATING AMPM: ", startHours)
    if (startHours >= 10) {  
      $scope.dateTime.startAMPM === "AM" ? $scope.dateTime.endAMPM = "PM" : $scope.dateTime.endAMPM = "AM";
    }
    if (startHours <= 9) {  
      $scope.dateTime.endAMPM = $scope.dateTime.startAMPM;
    }
  }

  $scope.changeEndMinutes = function() {
    $scope.dateTime.endMinutes = $scope.dateTime.startMinutes;
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
        zipCode: '',
        startDateTime: '',
        endDateTime: '',
        category: '',
        price: 0,
        coords: {lat: undefined, lng: undefined}
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

  $scope.saveNewEvent = function() {
    // TODO: Get userId from Auth, pass it into http call below
    $scope.newPostData.userId = 1;

    var photoFileName = makeHash(18) + '.jpg';
    var address = ($scope.newPostData.streetAddress1+'+'+$scope.newPostData.streetAddress2+'+'+$scope.newPostData.city+'+'+$scope.newPostData.state+'+'+$scope.newPostData.zipCode).split(' ').join('+')
    var timeZone = getDateTime().timeZone;

    Http.getCoordsForAddress(address, function(coords) {
      $scope.newPostData.coords = coords;
      $scope.newPostData.photoFileName = photoFileName;
      $ionicModal.fromTemplateUrl('app/modals/postSuccess.html', {
        scope: $scope,
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.openModal();
      });
      Http.saveNewEvent($scope.newPostData, function(res) {
        //Should be event id - Pass to photo for upload
      });
    });
    //if photo exists: upload photo by calling HTTP funciton.
    if($rootScope.photoUploaded){
      Http.uploadPhoto($scope.photoFile, photoFileName);
    } else {
      console.log('no photo attached, skipping photo upload protocol.')
    }
  };

  /************ EVENT INFO MODAL **************/
  $scope.liked = false;
  $scope.submitComment = function(comment, eventId) {
  $scope.eventInfo.comments.unshift({comment: comment})
    Http.addComment({
      user_id: 1,
      eventId: eventId,
      comment: comment
    }, function() {
      Http.getOneEvent(eventId, function(eventInfo) {
        // $scope.eventInfo.comments = eventInfo.comments.reverse();
      })
    })
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
    console.log("PREVIEW: ", preview)
    file = document.querySelector('input[type=file]').files[0];
    console.log("FILE: ", file)
    $scope.photoFile = file;
    reader = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
      console.log("LOADEND: ", preview.src)
    }

    if (file) {
      console.log("FOUND FILE")
      $rootScope.photoUploaded = true;
      reader.readAsDataURL(file);
      $scope.$apply();
    } else {
      console.log("ERROR! NO FILE!")
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