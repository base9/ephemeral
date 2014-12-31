
var Event = require('./events.model.js');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var utils = Promise.promisifyAll(require('./utils.js'));

var controller = module.exports;
var crontab = require('node-crontab');

var midnightCronJob = crontab.scheduleJob("1 * * * *", function () {
  fetchBatchDataFromEventbriteApi(1);
});

controller.getAll = function(req, res) {
  Event.fetchAll({
      withRelated: ['user','rating']
  }).then(function (collection) {
    utils.sendResponse(collection,res);
  });
};

controller.getOne = function(req, res) {
  Event.where({id:req.params.id}).fetch({
      withRelated: ['user','rating']
    }).then(function (record) {
      utils.sendResponse(record,res);
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
    utils.sendResponse(record,res);
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
    if(!event.date){
      console.log('event has no date field; skipping');
    } else {
      Event.where({title:event.title}).fetch()
      .then(function (record) {
        if(!record){
          var params = {};
          if(event.info){
            params.info = event.info.text;
          }
          
          //parse event address into a lat and lng, via Google Geocoding API w/ Brian's API key.
          utils.parseAddressAsync(event.address.text)
          .then(function(coordinates){
            params.lat = coordinates[0];
            params.lng = coordinates[1];
            return true;
          })

          //parse event times using Date.JS
          .then(function(bool){
            console.log("getting formatted times for event ", event.title);
            return utils.getStartEndTimesAsync(event.date.text,event.duration.text)
          })
          .then(function(formattedTimes){
              params.startTime = formattedTimes[0];
              params.endTime = formattedTimes[1];
            return true;
          })

          //save event to DB
          .then(function(bool){
            utils.addEventRecord(params,res);
          });
        } else {
          console.log('event already exists in DB; skipping');
        }
      });
    }
    if(events.length){
      setTimeout(recursiveAddEvents.bind(this,events),300);
    } else {
      res.status(201).end()
    }
  }
 recursiveAddEvents(events);
};



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








