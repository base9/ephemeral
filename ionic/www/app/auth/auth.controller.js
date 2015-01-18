angular.module('radar')
.controller('AuthController', ['$scope', '$http', function($scope, http) {

  $scope.signInWithFacebook = function() {
    OAuth.initialize('L3_Da00cNGJ1srYmK7TIzzMyWjI');
    OAuth.popup('facebook')
      .done(function(result) {
        console.log("OAUTH SUCCESS", result);
        result.get('https://graph.facebook.com/me?access_token=' + result.access_token)
        .then(function(userInfo) {
          console.log(userInfo);
        });
      })
      .fail(function(result) {
        console.log("OAUTH FAILED");
      });
  };

  $scope.signInWithGoogle = function() {
    OAuth.initialize('L3_Da00cNGJ1srYmK7TIzzMyWjI');
    OAuth.popup('google')
      .done(function(result) {
        console.log("OAUTH SUCCESS", result);
        result.get('https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=' + result.id_token)
        // result.get('https://www.googleapis.com/plus/v1/people/me?access_token=' + result.access_token) 
        .then(function(userInfo) {
          console.log(userInfo);
        });
      })
      .fail(function(result) {
        console.log("OAUTH FAILED");
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


}]);