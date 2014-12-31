//this will alter the global object 'Date'
require('./date.js');

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Event = require('./events.model.js');


module.exports = {
  addEventRecord: addEventRecord,
  sendResponse: sendResponse,
  getStartEndTimes: getStartEndTimes,
  getCoordsFromGoogleAPI: getCoordsFromGoogleAPI
}


//expects a record ready to be added to the Events table.
//will use a validation helper before adding to the table.
function addEventRecord(params, res){
  var validatedParams = validateEventRecord(params);
  var newEvent = new Event(validatedParams)
  .save()
  .then(function(){
    console.log('added new event: ' + params.title);
    if(res){
      res.status(201).end();
    } 
  });
};


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
function getCoordsFromGoogleAPI(addressString){
  console.log('helper fn now fetching coordinates');
  var formattedAddress = addressString.split(' ').join('+');
  var apiKey = 'AIzaSyBtd0KrHPVY6i17OdnrJ-ID8jsZ99afO8U';
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
  var reqUrl =  apiUrl + formattedAddress + '&key=' + apiKey;
  return request(reqUrl)
}

//input: ("Tuesday December 4th, 2014", "3pm to 6pm")
//output: an ISO 8601-formatted date/time tuple [startTime,endTime].
//ISO 8601 format is: YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)
function getStartEndTimes(dateString, durationString){

  var startTime;
  var endTime;

  if(durationString==="All Day"){
    startTime="12:00am";
    endTime="11:59pm";
  } else if(durationString.indexOf('to') > -1) {
    startTime = durationString.split('to')[0];
    endTime = durationString.split('to')[1];
  } else {
    startTime = durationString;
  }

  var formattedStartTime = Date.parse(dateString + ' ' + startTime).toISOString();
  var formattedEndTime = endTime ? Date.parse(dateString + ' ' + endTime).toISOString() : "";

  console.log('helper is sending back the formatted times');
  return [formattedStartTime, formattedEndTime];
}


function queryDb(params){

};

function parseKimonoJSON(req,res){

};

function parseEventbriteJSON(res){

};

//ensures that params are in order (must match Event schema)
//TODO: make this actually do something.
function validateEventRecord(params){
  return params;
};

//use this to schedule/throttle API calls so they don't go too fast and exceed our limit.
function scheduleCalls(callback,waitTime){

};

//TODO: make the throttledFn usable as a promise
function makeThrottledFunction(callback,delay){
  var waitTime = 0;
  return function(params){
    setTimeout(function(){
      callback(params);
      waitTime -=delay;
    },waitTime);
    waitTime += delay;
  }
}

