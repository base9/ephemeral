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
  //  console.log("seearchtext")
  // }
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

  // HOPEFULLY REMOVE THIS FUNCTION
  function getDateTime() {
    var dateString = (new Date()).toString().split(' ');
    dateString[4] = dateString[4].split(':');
    var hours = parseFloat(dateString[4][0])
    var AMPM;
    (hours > -1 && hours < 12) ? AMPM = "AM" : AMPM = "PM";
    if (hours > 12 || hours === 0) {
      hours = Math.abs(hours-12)
      if (hours > 0 && hours < 10) {
        hours = "0" + hours.toString();
      } else {
        hours = hours.toString();
      }
    }
    var minutes = Math.ceil(parseFloat(dateString[4][1])/5)*5;
    console.log("MINUTES: ", minutes)

    var dateTime = {
      month: dateString[1],
      day: dateString[2],
      year: dateString[3],
      hours: hours,
      minutes: minutes.toString(),
      timeZone: dateString[5],
      AMPM: AMPM
    }
    return dateTime;
  }

  $scope.getCurrentAddress = function() {
    console.log("getting address");
    Map.findCurrentLocation(function(coords) {  
      var address = Http.getAddressForCoords(coords.lat, coords.lng, function(address) {
        console.log(address);
        $scope.newPostData.streetAddress1 = address.streetAddress1;
        $scope.newPostData.city = address.city;
        $scope.newPostData.state = address.state;
        $scope.newPostData.zipCode = address.zipCode;
      });
    }); 
  };

  $scope.postNewEvent = function() {
    // TODO: Check for authentication. If authenticated, proceed. Else "Please Login or register to post events"
    var dateTime = getDateTime();
    var startHours = parseFloat(dateTime.hours)
    var endAMPM = dateTime.AMPM;
    var endHours = startHours + 2;
    if (endHours > 12) {
      endHours -= 12;
      endAMPM === "AM" ? endAMPM = "PM" : endAMPM = "AM";
    }
    if (endHours > 0 && endHours < 10) {
      endHours = "0" + endHours.toString();
    } else {
      endHours = endHours.toString();
    }


    console.log(dateTime)
    $scope.dateTime = {
      startDay: dateTime.day,
      startMonth: dateTime.month,
      startYear: dateTime.year, 
      startHours: dateTime.hours,
      startMinutes: dateTime.minutes,
      startAMPM: dateTime.AMPM,
      endDay: dateTime.day,
      endMonth: dateTime.month,
      endYear: dateTime.year, 
      endHours: endHours.toString(),
      endMinutes: dateTime.minutes,
      endAMPM: endAMPM
    }

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
        coords: {lat: undefined, lng: undefined}
      };

    $scope.photoUploaded = false;

    $ionicModal.fromTemplateUrl('app/modals/newEventModal.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.toggleRight();
      $scope.openModal();
    });
  };

  $scope.saveNewEvent = function() {
    // TODO: Get userId from Auth, pass it into http call below
    var userId = 1;
    // DUMMY INFO BELOW
    var address = ($scope.newPostData.streetAddress1+'+'+$scope.newPostData.streetAddress2+'+'+$scope.newPostData.city+'+'+$scope.newPostData.state+'+'+$scope.newPostData.zipCode).split(' ').join('+');
   
    function makeHash(len){
        var text = [];
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(var i = 0; i < len; i++){
            text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
        }
        return text.join('');
    }

    var photoFileName = makeHash(18);


    Http.getCoordsForAddress(address, function(coords) {
      $scope.newPostData.coords = coords;
      $scope.newPostData.photoFileName = photoFileName;
      Http.saveNewEvent($scope.newPostData);
    });

    //TODO: make sure the photo file object is actually available as $scope.file.
    Http.uploadPhoto($scope.file, photoFileName);

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

  /*************  UI Bootstrap Datepicker Functions ************/
  $scope.today = function() {
    $scope.startDate = new Date();
    $scope.endDate = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'MM.dd.yy', 'shortDate'];
  $scope.format = $scope.formats[2];

/*************  UI Bootstrap Timepicker Functions ************/

  $scope.startTime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 10;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };

/*************  Input type="file" Custom Functionality ************/

  $scope.getFile = function(){
      document.getElementById("upfile").click();
  }

  $scope.previewFile = function() {
    console.log("PREVIEW FILE")
    var preview = document.querySelector('#photoPreview');
    console.log("PREVIEW: ", preview)
    var file    = document.querySelector('input[type=file]').files[0];
    console.log("FILE: ", file)
    var reader  = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
    }

    if (file) {
      $scope.photoUploaded = true;
      reader.readAsDataURL(file);
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
