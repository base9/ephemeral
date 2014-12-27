//this will alter the global object 'Date'
require('./date.js');

var Event = require('./events.model.js');
var seed = require('./events.seed.js');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var controller = module.exports;

controller.getAll = function(req, res) {
  Event.fetchAll({
      withRelated: ['user','rating']
    }).then(function (collection) {
    res.json(collection);
  });
};

controller.getOne = function(req, res) {
  Event.where({id:req.params.id}).fetch({
      withRelated: ['user','rating']
    }).then(function (event) {
      if(event){
        res.json(event);
      } else {
        res.status(404).end();
      }
  });
};

controller.addOne = function(req, res) {
  var newEvent = new Event(req.body)
  .save()
  .then(function(){
    console.log('added new event: ' + req.body.title);
    res.status(201).end();
  });
};

controller.getLocal = function(req, res) {
  Event.query(function(qb){
    qb.whereBetween('lat', [req.query.lat1,req.query.lat2]);
    qb.whereBetween('lng', [req.query.lng1,req.query.lng2]);
  })
  .fetchAll({
     withRelated: ['user','rating']
  }).then(function (event) {
    if(event){
      res.json(event);
    } else {
      res.status(404).end();
    }
  });
};

//this function expects a large JSON object of events, that will be sent
//periodically by a Kimono Labs scraper.  Function will parse the events
//and add them to our DB.
controller.addBatchDataFromKimonoAPI = function(req, res) {
   console.log('post req received at Kimono endpoint!');
   var events = JSON.parse(req.body.results).collection1;

   var recursiveAddEvents = function(events){
    var evnt = events.shift();
    Event.where({title:evnt.title}).fetch().then(function (record) {
      if(!record){


        //parse event address into a lat and lng, via Google Geocoding API w/ Brian's API key.
        var apiKey = 'AIzaSyBtd0KrHPVY6i17OdnrJ-ID8jsZ99afO8U';
        var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
        var formattedAddress = evnt.address.text.split(' ').join('+');
        var reqUrl =  apiUrl + formattedAddress + '&key=' + apiKey;
        request(reqUrl)
          .then(function (res, body) {
            if (res.statusCode >= 400) {
              console.log(res.statusCode + ' error on request to Geocoding API');
            } else {
              var json = JSON.parse(res[0].body);
              if(json.results[0]){
                var lat = json.results[0].geometry.location.lat;
                var lng = json.results[0].geometry.location.lng;
                var startTime;
                var endTime;
                var info;

                if(evnt.date){
                  //TODO: refactor kimono API to use "duration" and "info" properties (not detail and startTime)
                  console.log("getting formatted times for event " + evnt.title);
                  var formattedTimes = getStartEndTimes(evnt.date.text,evnt.startTime.text);
                  startTime = formattedTimes[0];
                  endTime = formattedTimes[1];
                  console.log(startTime,endTime);
                }
                if(evnt.details){
                  info = evnt.details.text;
                }

                //create new event record for DB.
                var newEvent = new Event({
                  title: evnt.title,
                  lat: lat,  
                  lng: lng,
                  startTime: startTime,
                  endTime: endTime,
                  info: info,
                  //TODO: user_id should be a special account reserved for SF_funcheap_bot

                })
                .save();
                console.log('added new event "' + evnt.title + '"');
              } else {
                console.log("address missing or bad request; no event added.")
              }
            }
          });
        } else {
          console.log('event already exists in DB; skipping');
        }
    });
  if(events.length){
    setTimeout(recursiveAddEvents.bind(this,events),300);
  } else {
    res.status(201).end()
  }
 }
 recursiveAddEvents(events);
}

//output: an ISO 8601-formatted date/time tuple [startTime,endTime].
//format is: YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)
function getStartEndTimes(dateString, durationString){
  console.log(dateString);
  console.log(durationString);

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

  return [formattedStartTime, formattedEndTime]
}
















