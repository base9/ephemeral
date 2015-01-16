angular.module('radar')
.factory('HttpHandler', ['$http', '$upload', function($http, $upload) {

  var httpObject = {};

  httpObject.getMarkers = function(bounds, callback) {

    var pathname = '/api/events/local?lat1=' + bounds.ne.lat() + '&lat2=' + bounds.sw.lat() + '&lng1=' + bounds.ne.lng() + '&lng2=' + bounds.sw.lng();

    //get all events
    $http.get(pathname)
      .success(function(data, status) {
        httpObject.events = data;
        callback(data);
      })
      .error(function(data, status) {
        console.log("ERROR FOR API EVENTS");
      });
  };

  httpObject.getOneEvent = function(eventId, callback) {
    //get all events
    $http.get('/api/events/' + eventId )
      .success(function(data, status) {
        callback(data);
      })
      .error(function(data, status) {
        console.log("ERROR FOR API EVENTS");
      });
  };

  httpObject.getAddressForCoords = function(lat, lng, callback) {
    $http.get('/api/events/reversegeocode?lat=' + lat + '&lng=' + lng)
      .success(function(data, status) {
        callback(data);
      })
      .error(function(data, status) {
        console.log("ERROR FOR API EVENTS");
      });
  };

  httpObject.getCoordsForAddress = function(address, callback) {
    $http.get('/api/events/geocode?address=' + address)
      .success(function(data, status) {
        callback(data);
      })
      .error(function(data, status) {
        console.log("ERROR FOR API EVENTS");
      });
  };

  httpObject.saveNewEvent = function(postData) {
    console.log(postData);
    $http({
      method: 'POST',
      url: '/api/events',
      data: {
        title: postData.title,
        info: postData.info,
        startTime: postData.startDateTime,
        endTime: postData.endDateTime,
        lat: postData.coords.lat,
        lng: postData.coords.lng,
        category: postData.category,
        streetAddress1: postData.streetAddress1,
        streetAddress2: postData.streetAddress2,
        city: postData.city,
        state: postData.state,
        zipCode: postData.zipCode,
        user_id: postData.userId,
        photoFileName: postData.photoFileName
      }
    })
      .success(function(data, status) {
        console.log("posted new event");
      })
      .error(function(data, status) {
        console.log("ERROR FOR API EVENTS");
      });
  };

  httpObject.postLogin = function (userData) {
    return $http({
      method: 'POST',
      url: '/auth/login',
      data: userData
    });
  };

  httpObject.postSignup = function (userData) {
    return $http({
      method: 'POST',
      url: '/auth/signup',
      data: userData
    });
  };

  httpObject.addComment = function (commentData, callback) {
    console.log("data: ", commentData)
    return $http({
      method: 'POST',
      url: '/api/comments',
      data: commentData
    })
    .success(function(data, status) {
        callback;
      })
      .error(function(data, status) {
        console.log("ERROR FOR API EVENTS");
      });
  };


  httpObject.uploadPhoto = function(photo, photoFileName){         
    console.log('uploading now');
    
    var uploadParameters = {
      key: photoFileName,
      AWSAccessKeyId: 'AKIAIWPJUAIHVGA6VNSA',
      acl: 'private',
      policy: 'eyJleHBpcmF0aW9uIjoiMjAxNi0wMS0wMVQwMDowMDowMFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJiYXNlOXBob3RvcyJ9LFsic3RhcnRzLXdpdGgiLCIka2V5IiwiIl0seyJhY2wiOiJwcml2YXRlIn0sWyJzdGFydHMtd2l0aCIsIiRDb250ZW50LVR5cGUiLCIiXSxbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwwLDMxMzA1NzZdXX0=',
      signature: 'Aw6j1mlYJeC4OawIqe6thbZREEc=',
      'Content-Type': 'application/octet-stream'
      // filename: photoFileName // this is needed for Flash polyfill IE8-9
    };

    $upload.upload({
            url: 'https://base9photos.s3.amazonaws.com/', //S3 upload url including bucket name
            method: 'POST',
            data : uploadParameters,
            file: photo,
          })
      .progress(function(evt) {
        console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name);
      }).success(function(data, status, headers, config) {
        console.log('file ' + photoFileName + ' is uploaded successfully. Response: ', status, data);
      }).error(function(data, status, headers, config) {
        console.log('file ' + photoFileName + ' failed to upload. Response: ', status, data);
      });
  }



  return httpObject;
}]);