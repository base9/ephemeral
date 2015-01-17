angular.module('radar')
.factory('HttpHandler', ['$http', '$upload', function($http, $upload) {

  var httpObject = {};
  var geocoder;

  httpObject.getEvents = function(bounds, callback) {

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
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat,lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          callback(results[0].formatted_address);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  };

  httpObject.getCoordsForAddress = function(address, callback) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var coords = {
          lat: results[0].geometry.location.k,
          lng: results[0].geometry.location.D
        }
        callback(coords);
      };
    })
  };

  httpObject.saveNewEvent = function(postData, callback) {
    console.log(postData);
    $http({
      method: 'POST',
      url: '/api/events',
      data: postData
    })
      .success(function(data, status) {
        callback(data);
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

  httpObject.updateRating = function (addSubtract, eventId) {
    return $http({
      method: 'POST',
      url: '/api/ratings',
      data: {
        addSubtract: addSubtract, 
        event_id: eventId
      }
    })
    .success(function(data, status) {
        console.log("Rating updated")
      })
      .error(function(data, status) {
        console.log("ERROR FOR API EVENTS");
      });
  };


  httpObject.uploadPhoto = function(photo, photoFileName, eventId){         
    console.log('uploading now to event: ', eventId);

    //TODO: fetch this stuff via HTTP request, instead of hardcoding here.
    var uploadParameters = {
      key: photoFileName,
      AWSAccessKeyId: 'AKIAIWPJUAIHVGA6VNSA',
      acl: 'private',
      policy: 'eyJleHBpcmF0aW9uIjoiMjAxNi0wMS0wMVQwMDowMDowMFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJiYXNlOXBob3RvcyJ9LFsic3RhcnRzLXdpdGgiLCIka2V5IiwiIl0seyJhY2wiOiJwcml2YXRlIn0sWyJzdGFydHMtd2l0aCIsIiRDb250ZW50LVR5cGUiLCIiXSxbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwwLDMxMzA1NzZdXX0=',
      signature: 'Aw6j1mlYJeC4OawIqe6thbZREEc=',
      'Content-Type': 'application/octet-stream'
    };

    $upload.upload({
            url: 'https://base9photos.s3.amazonaws.com/',
            method: 'POST',
            data : uploadParameters,
            file: photo,
          })
      .progress(function(evt) {
        console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name);
      }).success(function(data, status, headers, config) {
        console.log('file ' + photoFileName + ' is uploaded successfully. Response: ', status, data);
        linkPhotoToEventRecord(photoFileName);
      }).error(function(data, status, headers, config) {
        console.log('file ' + photoFileName + ' failed to upload. Response: ', status, data);
      });

    function linkPhotoToEventRecord(photoFileName){
      console.log('now apprising main server of photo upload.')
      $http({
        method: 'POST',
        url: '/api/photos/addOne',
        data: {
          event_id: eventId,
          url: 'https://s3-us-west-1.amazonaws.com/base9photos/' + photoFileName
        }
      });
    }

  }

  return httpObject;
}]);