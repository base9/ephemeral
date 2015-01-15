angular.module('radar').controller('NewEventModalController', [
  'MapFactory', 
  'MarkerFactory', 
  'HttpHandler', 
  '$scope', 
  function(Map, Marker, Http, $scope) {

    $scope.saveNewEvent = function() {
      console.log("SAVING NEW EVENT");
    };

    $scope.test = "HELLO";

    $scope.uploadPhoto = function ($files) {
      var file = $files[0];
      $scope.upload = $upload.upload({
        url: 'S3 signed URL HERE!!!',
        method: 'POST',
        file: file,
      }).progress(function (evt) {
        // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function (data, status, headers, config) {
        $state.reload();
      }).error(function (err) {
        console.log('ERROR:', err);
      });
    };


}]);




