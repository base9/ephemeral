//this will alter the global object 'Date'
require('./date.js');

var Event = require('./events.model.js');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var utils = require('./utils.js');

var controller = module.exports;
var crontab = require('node-crontab');

var midnightCronJob = crontab.scheduleJob("1 * * * *", function () {
  fetchBatchDataFromEventbriteApi(1);
});

controller.getAll = function(req, res) {
  Event.fetchAll({
      withRelated: ['user','rating']
  }).then(function (collection) {
    sendResponse(collection,res);
  });
};

controller.getOne = function(req, res) {
  Event.where({id:req.params.id}).fetch({
      withRelated: ['user','rating']
    }).then(function (record) {
      sendResponse(record,res);
  });
};

controller.addOne = function(req, res) {
  utils.addEventRecord(req.body,res);
};

controller.getLocal = function(req, res) {
  Event.query(function(qb){
    qb.whereBetween('lat', [req.query.lat1,req.query.lat2]);
    qb.whereBetween('lng', [req.query.lng1,req.query.lng2]);
  })
  .fetchAll({
     withRelated: ['user','rating']
  }).then(function (record) {
    sendResponse(record,res);
  });
};

//this function expects a large JSON object of events, that will be sent
//periodically by a Kimono Labs scraper.  Function will parse the events
//and add them to our DB.
controller.addBatchDataFromKimonoAPI = function(req, res) {
   console.log('post req received at Kimono endpoint!');
   
   var events = req.body.results.collection1;
   var recursiveAddEvents = function(events){
    var event = events.shift();
    Event.where({title:event.title}).fetch().then(function (record) {
      if(!record){

        //parse event address into a lat and lng, via Google Geocoding API w/ Brian's API key.
        var apiKey = 'AIzaSyBtd0KrHPVY6i17OdnrJ-ID8jsZ99afO8U';
        var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
        var formattedAddress = event.address.text.split(' ').join('+');
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

                if(event.date){
                  console.log("getting formatted times for event ", event.title);
                  var formattedTimes = getStartEndTimes(event.date.text,event.duration.text);
                  //TODO: refactor kimono API to use "duration" and "info" properties (not detail and startTime)
                  startTime = formattedTimes[0];
                  endTime = formattedTimes[1];
                }
                if(event.info){
                  info = event.info.text.slice(0,2000);
                }

                //create new event record for DB.
                var newEvent = new Event({
                  title: event.title,
                  lat: lat,  
                  lng: lng,
                  startTime: startTime,
                  endTime: endTime,
                  info: info,
                  //TODO: user_id should be a special account reserved for SF_funcheap_bot

                })
                .save();
                console.log('added new event "' + event.title + '"');
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
};

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
};
  
function fetchBatchDataFromEventbriteApi(pageNumber){
  console.log("fetching page " + pageNumber + "!");
  var reqUrl = 'https://www.eventbriteapi.com/v3/events/search/?token=WUETWTBHZAXVIQK46NZM&start_date.keyword=today&venue.country=US'
  reqUrl += '&page=' + pageNumber;
  request(reqUrl)
    .then(function (eventbriteRes) {
      var body = JSON.parse(eventbriteRes[0].body);
      body.events.forEach(function(event){
        Event.where({title:event.name.text}).fetch().then(function (record) {
          if(!record){
            var newEvent = new Event({
              title: event.name.text,
              lat: event.venue.latitude,  
              lng: event.venue.longitude,
              startTime: event.start.utc,
              endTime: event.end.utc,
              info: (event.description.text ? event.description.text.slice(0,2000) : '')
              //TODO: user_id should be a special account reserved for Eventbrite_bot
              //TODO: do something better than a title match for preventing duplicate entries
            })
            .save();
            console.log('added new event "' + event.name.text + '"');
          } else {
            console.log("event with that title already exists; skipping.")
          }
        });
      });
      if(pageNumber < body.pagination.page_count) {
        console.log( (body.pagination.page_count - pageNumber) + " pages remaining.")
        setTimeout(recursiveFetch.bind(this,pageNumber+1),500)
      }
    })
};








