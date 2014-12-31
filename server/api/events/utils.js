//this will alter the global object 'Date'
require('./date.js');


module.exports = {
  addEventRecord: addEventRecord,
  sendResponse: sendResponse,
  getStartEndTimes: getStartEndTimes,
  getCoordsFromAddress: getCoordsFromAddress
}


//expects a record ready to be added to the Events table.
//will use a validation helper before adding to the table.
function addEventRecord(params, res){
  var validatedParams = validateEventRecord(params);
  var newEvent = new Event(validatedParams)
  .save()
  .then(function(){
    console.log('added new event: ' + params.title);
    res.status(201).end();
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
function getCoordsFromAddress(addressString){
  var formattedAddress = addressString.split(' ').join('+');
  var apiKey = 'AIzaSyBtd0KrHPVY6i17OdnrJ-ID8jsZ99afO8U';
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
  var reqUrl =  apiUrl + formattedAddress + '&key=' + apiKey;
  
  request(reqUrl)
  .then(function(res) {
    if (res.statusCode >= 400) {
      console.log(res.statusCode + ' error on request to Geocoding API');
    } else {
      var json = JSON.parse(res[0].body);
      if(json.results[0]){
        var lat = json.results[0].geometry.location.lat;
        var lng = json.results[0].geometry.location.lng;
        return([lat,lng]);
      }
      return [0,0];
    }
  });
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

