//this will alter the global object 'Date'
// require('./date.js');

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Event = require('./events.model.js');


module.exports = {
  addEventRecord: addEventRecord,
  sendResponse: sendResponse,
  getStartEndTimes: getStartEndTimes,
  makeThrottledFunction: makeThrottledFunction,
  formatAndTrimEventRecords: formatAndTrimEventRecords,
  generateRandomLong: generateRandomLong,
  generateRandomLat: generateRandomLat
};

//expects a record ready to be added to the Events table.
//will use a validation helper before adding to the table.
function addEventRecord(params, res){
  var validatedParams = validateEventRecord(params);
  return new Event(validatedParams)
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
    if(event.relations && event.relations.rating){
      
      //THESE LINES DEPRECATED: ratings table not in use.
      // event.attributes.ratings = event.relations.rating.length;
      // event.attributes.popularity = getPopularity(event.attributes.ratings);
      delete event.relations.rating;
    }
    if(event.relations && event.relations.user){
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

// LONGITUDE -180 to + 180
function generateRandomLong() {
    var num = (Math.random()*180);
    var posorneg = Math.round(Math.random());
    if (posorneg == 0) {
        num = num * -1;
    }
    return num;
}
// LATITUDE -90 to +90
function generateRandomLat() {
    var num = (Math.random()*90);
    var posorneg = Math.round(Math.random());
    if (posorneg == 0) {
        num = num * -1;
    }
    return num;
}


