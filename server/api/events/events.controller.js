
var Event = require('./events.model.js');
var Bluebird = require('bluebird');
var request = Bluebird.promisify(require('request'));
var utils = require('./utils.js');
var commentController = require('../comments/comments.controller.js');


/********************* Module.exports *************************/

module.exports = {
  getAll: getAll,
  getOne: getOne,
  addOne: addOne,
  getLocal: getLocal,
  fetchBatchDataFromKimonoAPI: fetchBatchDataFromKimonoAPI,
  fetchBatchDataFromEventbriteAPI: fetchBatchDataFromEventbriteAPI,
  getCoordsFromAddress: getCoordsFromAddress,
  getAddressFromCoords: getAddressFromCoords,
  addManySpoofs: addManySpoofs
};

/******************** Generic DB interactions **********************/

function getAll(req, res) {
  Event.fetchAll()
  .then(function (collection) {
    utils.sendResponse(utils.formatAndTrimEventRecords(collection),res);
  });
}

function getOne(req, res) {
  Event.where({id:req.params.id}).fetch({
      withRelated: ['user', 'photos', 'comments']
    }).then(function (record) {
      if(record){
        utils.sendResponse(utils.formatAndTrimEventRecords([record])[0],res);
      } else {
        res.status(404).end('No event with that id.');
      }

  });
}

function addOne(req, res) {
  request(
    { method: 'POST',
      uri: process.env.PARSER_SERVER_URL + 'api/events/',
      form: req.body, 
    })
  .then(function (response) {
    if(response[0].statusCode == 201){
      console.log('parser reports event saved.');
      res.status(201).end(response[0].body)
    } else {
      console.log('error: '+ response[0].statusCode);
    }
  });
}

function addManySpoofs(req,res){
  res.status(200).end();
  var numSpoofs = req.query.number;
  for(var i = 0; i < numSpoofs; i++){
    var newEvent = new Event({
      title: 'Spoof event #' + i,
      startTime: Date.now(),
      endTime: Date.now()+20000000,
      lat: utils.generateRandomLat(),
      lng: utils.generateRandomLong(),
      user_id: 1,
      info: 'info for spoof event #' + i,
      category: 'Party',
      streetAddress1: '1 Embarcadero Blvd',
      streetAddress2: 'Suite 101',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      price: Math.random()*100
    })
    .save();
  }
}

function getLocal(req, res) {
    
    //two dates are used to get modified
    var date1 = new Date();
    var date2 = new Date();

    //currentTime is used to keep track of current time
    var currentTime = Date.now();

    //beginningDate to current date at 3 a.m.
    var beginningDate = date1.setHours(3, 0, 0, 0);

    //endingDate to next day at 3 a.m.
    date2.setDate(date1.getDate() + 1);
    var endingDate = date2.setHours(3, 0, 0, 0);

  Event.query(function(qb){

    //Narrows down events based on specified location
    qb.whereBetween('lat', [Math.min(req.query.lat1,req.query.lat2),Math.max(req.query.lat1,req.query.lat2)]);
    qb.whereBetween('lng', [Math.min(req.query.lng1,req.query.lng2),Math.max(req.query.lng1,req.query.lng2)]);

    //Narrows down events within specified ISO8601 time
    qb.where('startTime', '<', endingDate)
      .andWhere('endTime', '>', beginningDate)
      .andWhere('endTime', '>', currentTime)
      .orWhere('endTime', null);
  })
  .fetchAll()
  .then(function (collection) {
    utils.sendResponse(utils.formatAndTrimEventRecords(collection),res);
  });
}

/************** Geocoding ******************/

//returns a promise of an http response.  parse the response like this:
//var coords = JSON.parse(res[0].body);
//coords will be a lat, lng tuple like [44.5, -122.67]
function getCoordsFromAddress(address) {
  return request( process.env.GEOCODING_SERVER_URL + 'geo/geocode?address=' + address);
}

//returns a promise of an http response.  parse the response like this:
//var address = JSON.parse(res[0].body);
//'address' will be an object with fields like addressLine1, city, state, zipCode, etc.
function getAddressFromCoords(coords) {
  return request( process.env.GEOCODING_SERVER_URL + 'geo/reverseGeocode?lat=' + coords[0] + '&lng=' + coords[1]);
}


/************** Kimono API functions ******************/

function fetchBatchDataFromKimonoAPI(req, res) {
  request( process.env.PARSER_SERVER_URL + 'api/events/kimono')
  .then(function(response){
    if(response[0].statusCode == 201){
      var msg = 'parser acknowledges request to run Kimono fetching';
      console.log(msg);
      res.status(201).end(msg);
    } else {
      var errorMsg = 'parser reports error regarding Kimono fetch request';
      console.log(errorMsg);
      res.status(400).end(errorMsg);
    }
  });
}
  

/************** Eventbrite API functions ******************/

function fetchBatchDataFromEventbriteAPI(req, res){
  request( process.env.PARSER_SERVER_URL + 'api/events/eventbrite')
  .then(function(response){
    if(response[0].statusCode == 201){
      var msg = 'parser acknowledges request to run Eventbrite fetching';
      console.log(msg);
      res.status(201).end(msg);
    } else {
      var errorMsg = 'parser reports error regarding Eventbrite fetch request';
      console.log(errorMsg);
      res.status(400).end(errorMsg);
    }
  });
}


