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

/***************** PHOTO UPLOAD *****************/

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