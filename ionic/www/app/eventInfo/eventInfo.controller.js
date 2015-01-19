angular.module('radar')
.controller('EventModalController', [
  'HttpHandler',
  'PhotoFactory',
  'DateTimeFactory',
  'SharedProperties',
  'MapFactory',
  '$scope',
  '$rootScope',
  function(Http, Photo, DateTime, Shared, Map, $scope, $rootScope) {
    var pos;
    $scope.liked = false;
    $rootScope.photoUploaded = false;
    $scope.eventInfo = Shared.getEvent();
    $scope.eventInfo.price === "0.00" ? $scope.eventInfo.price = "Free" : $scope.eventInfo.price = '$'+ $scope.eventInfo.price;
    $scope.eventInfo.startDate = DateTime.isoDateToTimeString(parseInt($scope.eventInfo.startTime));
    $scope.eventInfo.endDate = DateTime.isoDateToTimeString(parseInt($scope.eventInfo.endTime));
    $scope.eventInfo.mainPhoto = $scope.eventInfo.photos[0] || 
      {url: './img/thumbnails/' + $scope.eventInfo.category + '.jpg'};
    $scope.eventInfo.photos = $scope.eventInfo.photos.slice(1);
    $scope.eventInfo.comments = $scope.eventInfo.comments.reverse();
    if ($scope.eventInfo.city) { $scope.eventInfo.city += ','; }

    $scope.submitComment = function(comment) {
      Http.addComment({
        event_id: $scope.eventInfo.id,
        comment: comment
      });
    };
    
    $scope.updateRating = function(addSubtract) {
      Http.updateRating(addSubtract, $scope.eventInfo.id);
    };

    $scope.closeModalAndGetDirections = function () {
      var event;
      if (event = $scope.eventInfo) {
        pos = {
          lat: event.lat,
          lng: event.lng
        };
        Map.getDirections(pos);
        $scope.closeModal();
      }
    };

/*********** PHOTO UPLOAD/PREVIEW FUNCTIONS ********/

    $scope.getFile = function() {
      Photo.getFile();
    };

    $scope.previewFile = function() {
      Photo.previewFile();
      $rootScope.photoUploaded = true;
      $scope.$apply();
    };

    $scope.sub = function(obj) {
      Photo.sub(obj);
    };

}])
.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});