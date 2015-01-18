angular.module('radar', [
  'ionic',
  'ui.bootstrap',
  'angularFileUpload'
  ])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'app/core/app.template.html'
  })
})
.service('SharedProperties', function () {
  var event;
  var listOfEvents;
  var inEvent;
  return {
    getEvent: function () {
      return event;
    },
    setEvent: function(value) {
      event = value;
      console.log("SET EVENT: ", value);
    },
    getListOfEvents: function () {
      return listOfEvents;
    },
    setPhotoUploaded: function(value) {
      listOfEvents = value;
    },
    getInEvent: function () {
      return inEvent;
    },
    setInEvent: function(value) {
      inEvent = value;
    },
  };
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
