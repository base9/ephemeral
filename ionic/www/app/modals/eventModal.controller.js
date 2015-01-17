angular.module('radar')
.controller('EventModalController', [
  'MapFactory', 
  'MapSearchFactory', 
  'MarkerFactory', 
  'HttpHandler', 
  '$ionicModal',
  '$scope',
  '$rootScope', 
  function(Map, SearchBox, Marker, Http, $ionicModal, $scope, $rootScope) {

    $scope.liked = false;
    
    $scope.submitComment = function(comment) {
      Http.addComment({
        event_id: $rootScope.eventId,
        comment: comment
      })
    }

    $scope.updateRating = function(addSubtract) {
      Http.updateRating(addSubtract, $rootScope.eventId);
    }

}]);