//this will alter the global object 'Date'
// require('./date.js');

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Event = require('./events.model.js');


module.exports = {
  addEventRecord: addEventRecord,
  sendResponse: sendResponse,
  getStartEndTimes: getStartEndTimes,
  geocodeGoogleAPIRequest: geocodeGoogleAPIRequest,
  reverseGeocodeGoogleAPIRequest: reverseGeocodeGoogleAPIRequest,
  getCoordinatesFromGoogleAPIResponse: getCoordinatesFromGoogleAPIResponse,
  makeThrottledFunction: makeThrottledFunction,
  parseGoogleAPIAddress: parseGoogleAPIAddress,
  formatAndTrimEventRecords: formatAndTrimEventRecords
};

//expects a record ready to be added to the Events table.
//will use a validation helper before adding to the table.
function addEventRecord(params, res){
  var validatedParams = validateEventRecord(params);
  new Event(validatedParams)
    .save()
    .then(function(model){
      if(res){
        res.status(201).end(model.attributes.id.toString());
      } 
      console.log("added event to database: " + model.attributes.title);
      return model.attributes.id.toString();
    });
}

function sendResponse(record, res){
  if(record){
    res.json(record);
  } else {
    res.status(404).end();
  }
}

//input: a string such as '1600 Amphitheater Parkway, Mountain View CA'
//output: a lat & long tuple, such as [-37.211, 122.5819]
//returns [0,0] on error. (TODO: refactor this)
function geocodeGoogleAPIRequest(addressString){
  var formattedAddress = addressString.split(' ').join('+');
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='; 
  var reqUrl =  apiUrl + formattedAddress + '&key=' + process.env.GOOGLE_GEOCODING_API_KEY;
  return request(reqUrl);
}


function getCoordinatesFromGoogleAPIResponse(res){
  if (res.statusCode >= 400) {
    console.log(res.statusCode + ' error on request to Geocoding API');
  } else {
    var json = JSON.parse(res[0].body);
    if(json.results[0]){
      var lat = json.results[0].geometry.location.lat;
      var lng = json.results[0].geometry.location.lng;
      return [lat,lng];
    }
    return [0,0];
  }
}

function reverseGeocodeGoogleAPIRequest(coords){
  var formattedCoords = coords.lat+','+coords.lng;
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  var reqUrl =  apiUrl + formattedCoords + '&key=' + process.env.GOOGLE_GEOCODING_API_KEY;
  console.log("REQUEST URL: ", reqUrl);
  return request(reqUrl);
}

function parseGoogleAPIAddress(res){
  if (res.statusCode >= 400) {
    console.log(res.statusCode + ' error on request to Geocoding API');
  } else {
    var address = JSON.parse(res[0].body).results[0].formatted_address;
    address = address.split(',');
    address[2] = address[2].split(' ');
    addressParams = {
      streetAddress1: address[0],
      city: address[1],
      state: address[2][1],
      zipCode: address[2][2],
      country: address[3]
    };   
    return addressParams;
  }
}

//input: ("Tuesday December 4th, 2014", "3pm to 6pm")
//output: an ISO 8601-formatted date/time tuple [startTime,endTime].
//ISO 8601 format is: YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)
function getStartEndTimes(dateString, durationString){

  var startTime;
  var endTime;

  if(durationString==="All Day"){
    startTime="12:00 am";
    endTime="11:59 pm";
  } else if(durationString.indexOf('to') > -1) {
    startTime = durationString.split('to')[0];
    endTime = durationString.split('to')[1];
  } else {
    startTime = durationString;
  }

  var formattedStartTime = Date.parse(dateString + ' ' + startTime);
  console.log("formattedStartTime: ", formattedStartTime);
  var formattedEndTime = endTime ? Date.parse(dateString + ' ' + endTime) : null;
  console.log("formattedEndTime: ", formattedEndTime);

  return [formattedStartTime, formattedEndTime];
}


//ensures that params are in order (must match Event schema)
//TODO: make this actually do something.
function validateEventRecord(params){
  return params;
}

function formatAndTrimEventRecords(collection){
  var trimmed = collection.map(function(event){
    if(event.relations.rating){
      event.attributes.ratings = event.relations.rating.length;
      event.attributes.popularity = getPopularity(event.attributes.ratings);
      delete event.relations.rating;
    }
    if(event.relations.user){
      event.attributes.creator = event.relations.user.attributes.name;
      delete event.relations.user;
    }
    return event;
  });
  return trimmed;
}



//TODO: make the throttledFn usable as a promise
function makeThrottledFunction(callback,interval){
  var queue = [];
  var isAsleep = true;

  function invokeFromQueue(){
    if(queue.length){
      isAsleep = false;
      callback.apply(null,queue.shift());
      setTimeout(invokeFromQueue,interval);
    } else {
      isAsleep = true;
    }
  }

  return function(){
    var args = Array.prototype.slice.call(arguments);
    queue.push(args);
    if(isAsleep){
      invokeFromQueue();
    }
  };
}

//accepts a rating integer and converts it to a scale of 1-5.
//(somewhat arbitrarily)
function getPopularity(rating){
  var popularity = Math.ceil(rating / 20);
  popularity = Math.max(popularity, 1);
  popularity = Math.min(popularity, 5);
  return popularity;
}




