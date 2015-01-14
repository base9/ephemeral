angular.module('radar')
.factory('MarkerFactory', function() {
  var markerObj = {};
  var markers = [];

  //filters is an object with properties popularity, category, distance, and keyword
  markerObj.placeMarkers = function(map, events, callback) {

    // var bounds = new google.maps.LatLngBounds();

    if (events.length === 0) {
      return;
    }

    // create new markers for all events
    createMarkers(map, events, markers);

    callback(markers);
  };
  //not using other above function because no callback is needed
  markerObj.filterMarkers = function(map, objFilters, filters) {
    // remove all existing markers
    hideMarkers();

    // var bounds = new google.maps.LatLngBounds();

    var events = objFilters.events;
    if (filters) {
      //filter.popularity is a number
      if (filters.popularity) {
        events = filterPopularity(events, filters.popularity);
      }
      //filter.category is a string
      if (filters.category) {
        events = filterCategory(events, filters.category);
      }
      //filter.distance is a number in miles
      if (filters.distance) {
        events = filterDistance(events, objFilters.location, filters.distance);
      }
      //filters.keyword is an array of stringed keywords
      if (filters.keyword) {
        var temp = filterKeyword(events, filters.keyword);
        if (temp.foundMatch) {
          events = temp.results;
        } else {
          events = [];
          //return that the keywords do not match any event
        }
      }
      //filters.cost is an object with lowEnd and highEnd properties containing a number
      if (filters.cost) {
        events = filterCost(events, filters.cost);
      }
      //filters.time is an object with new, startTime, and endTime as a boolean, string, and string, respectively
      //The string must be capable of being parsed by Date.parse()
      if (filters.time.now || filters.time.startTime || filters.time.endTime) {
        events = filterTime(events, filters.time.now, filters.time.startTime, filters.time.endTime);
      }
      console.log("NEW EVENTS", events);
    }

    console.log("MARKERS1", markers);
    console.log("MARKERS2", markers[0].position.lat());
    console.log("MARKERS3", markers[0].position.k);

    // for (var i = 0; i < events.length; i++) {
    //   if (events[i] in matches)
    // };

    showMarkers(events, markers);

    // createMarkers(map, events, markers);

    // callback(events, markers);

  };

/********************* HELPER FUNCTIONS *********************/
  
  var createMarkers = function(map, events, markers) {
    var timeNow = Date.now();
    var happeningNow = '';
    var eventCategory = '';
    var popular = '';
    var markup = '';
    var markerUrl = '';
    var ringUrl = '';

    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      var position = new google.maps.LatLng(event.lat, event.lng);

      // add 'happening-now' class if event is happening right now
      (event.startTime < timeNow && timeNow < event.endTime) ? happeningNow = 'happening' : happeningNow = 'notHappening';

      // add category and popularity classes to marker
      eventCategory = 'category-' + event.category + ' ';
      popularity = 'popularity-' + Math.floor(Math.random()*5) + ' ';

      // build marker image src url by category
      markerUrl = "img/markers/" + event.category + "_marker.png";
      ringUrl = "img/rings/" + event.category + ".png";

      // build marker markup
      markup = 
        '<div class="richmarker ' 
        + eventCategory
        + '">'
        + '<img src="' + ringUrl + '" class="ring '+ happeningNow + ' " /></div>'
        + '<img src="' + ringUrl + '" class="ring '+ happeningNow + '2 " /></div>'
        + '<img src="' + markerUrl + '" class="marker ' + popularity + '" /></div>';

      markers.push(new RichMarker({
        map: map,
        position: position,
        draggable: false,
        content: markup,
        shadow: 'none'
      }));
    }
  };

  //Removes all markers on the map
  var hideMarkers = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setVisible(false);
    }
  };

  var showMarkers = function(events, markers) {
    for (var i = 0; i < events.length; i++) {
      for (var j = 0; j < markers.length; j++) {
        if (events[i].lat == markers[j].position.lat() && events[i].lng == markers[j].position.lng()) {
          console.log("MATCH");
          markers[j].setVisible(true);
        }
      }
    }
  }

  var filterPopularity = function(events, popularity) {
    var results = [];
    for (var i = 0; i < events.length; i++) {
      if (events[i].popularity >= popularity) {
        results.push(events[i]);
      }
    }
    return results;
  };

  var filterCategory = function(events, category) {
    var results = [];
    for (var i = 0; i < events.length; i++) {
      if (events[i].category === category) {
        results.push(events[i]);
      }
    }
    return results;
  };

  var filterDistance = function(events, userLocation, distance) {
    var results = [];
    var parameters = latitudeLongitudeToDistanceConverter(userLocation.lat, userLocation.lng, distance);
    for (var i = 0; i < events.length; i++) {
      if (withinCoordinates(events[i], userLocation, parameters)) {
        results.push(events[i]);
      }
    }
    return results;
  };

  var filterKeyword = function(events, keyword) {
    var results = [];
    var count = 0;
    for (var i = 0; i < events.length; i++) {
      if (events[i].title && events[i].info) {
        if (events[i].title.search(keyword) !== -1 || events[i].info.search(keyword) !== -1) {
          results.push(events[i]);
          count++;
        }
      }
    }
    if (count > 0) {
      return {'foundMatch': true, 'results': results}; 
    } else {
      return {'foundMatch': false};
    }
  };

  var filterCost = function(events, cost) {
    var results = [];
    for (var i = 0; i < events.length; i++) {
      if (events[i].price <= cost) {
        results.push(events[i]);
      }
    }
    return results;
  };

  //All time will be dealt in number of milliseconds since Jan 1, 1970
  var filterTime = function(events, now, startTime, endTime) {
    var results = [];
    var twoHoursInMilliseconds = 7200000;
    var start;
    var end;
    for (var i = 0; i < events.length; i++) {
      if (now) {
        start = Date.now();
        end = Date.now() + twoHoursInMilliseconds;
      } else {
        start = Date.parse(startTime);
        if (endTime) {
          end = Date.parse(endTime);
        } else {
          //If no end time is specified, then end time will be set to 3 a.m. of the next day
          var temp = new Date();
          temp.setDate(temp.getDate() + 1);
          end = temp.setHours(3, 0, 0, 0);
        }
      }
      if (events[i].endTime >= start && events[i].startTime <= end) {
        results.push(events[i]);
      }
    }
    return results;
  };

  var latitudeLongitudeToDistanceConverter = function(lat, lng, d) {
    console.log("LAT: ", lat, "LNG:", lng);
    Number.prototype.toRadians = function() {
      return this * Math.PI / 180;
    };
    Number.prototype.toDegrees = function() {
      return this * 180 / Math.PI;
    };

    //Radius of Earth in miles
    var R = 3959;

    //Converts degrees to radians
    var lat1 = lat.toRadians();
    var lng1 = lng.toRadians();

    //find second latitude from 0º clockwise from North
    var lat2North = Math.asin(Math.sin(lat1) * Math.cos(d/R) + Math.cos(lat1) * Math.sin(d/R) * Math.cos(0));

    //find second longitude from 90º clockwise from North (needs lat2East to find second longitude)
    var lat2East = Math.asin(Math.sin(lat1) * Math.cos(d/R) + Math.cos(lat1) * Math.sin(d/R) * Math.cos(Math.PI / 2));
    var lng2East = lng1 + Math.atan2(Math.sin(Math.PI / 2) * Math.sin(d/R) * Math.cos(lat1), Math.cos(d/R) - Math.sin(lat1) * Math.sin(lat2East));

    return {'north': lat2North.toDegrees() - lat, 'east': lng2East.toDegrees() - lng};
  };

  var withinCoordinates = function(events, userLocation, parameters) {
    if (events.lat <= userLocation.lat + parameters.north
      && events.lat >= userLocation.lat - parameters.north
      && events.lng <= userLocation.lng + parameters.east
      && events.lng >= userLocation.lng - parameters.east) {
      return true;
    }
    return false;
  };

  return markerObj;
});

