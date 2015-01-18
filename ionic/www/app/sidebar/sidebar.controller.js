angular.module('radar')
.controller('MenuController', [
  '$scope',
  '$ionicNavBarDelegate',
  '$ionicSideMenuDelegate',
  '$ionicModal',
  '$timeout',
  function($scope, $ionicNavBarDelegate, $ionicSideMenuDelegate, $ionicModal, $timeout) {

// Sets navbar title
  $timeout(function() {
    $ionicNavBarDelegate.handle = 'navBar';
    $ionicNavBarDelegate.title('Ephemeral');
  }, 150);

/****************** BASIC MODAL FUNCTIONS *******************/

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };


/****************** OPENS MODALS *******************/

  $scope.openLogin = function() {
    $ionicModal.fromTemplateUrl('app/auth/login.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.toggleRight();
      $scope.openModal();
    });
  };

  $scope.openRegister = function() {
    $ionicModal.fromTemplateUrl('app/auth/register.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.toggleRight();
      $scope.openModal();
    });
  };

  $scope.openPostEvent = function() {
    $ionicModal.fromTemplateUrl('app/postEvent/postEvent.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.toggleRight();
      $scope.openModal();
    });
  };


}]);