
var Event = require('./events.model.js');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var utils = require('./utils.js');
var crontab = require('node-crontab');


/****************** scheduled function calls *****************/

//these scrapers run 5x a day, at 12:01, 4:01, 8:01, etc
var cronJob = crontab.scheduleJob("1 */4 * * *", function () {
  console.log("****************it's cron time!******************")
  controller.fetchBatchDataFromEventbriteAPI();
  controller.fetchBatchDataFromKimonoAPI();
});


/********************* Module.exports *************************/

module.exports = {
  getAll: getAll,
  getOne: getOne,
  addOne: addOne,
  getLocal: getLocal,
  fetchBatchDataFromKimonoAPI: fetchBatchDataFromKimonoAPI,
  fetchBatchDataFromEventbriteAPI: fetchBatchDataFromEventbriteAPI
};

/******************** Generic DB interactions **********************/

function getAll(req, res) {
  Event.fetchAll({
      withRelated: ['user','rating']
  }).then(function (collection) {
    var trimmed = collection.map(function(event){
      event.attributes.creator = event.relations.user.attributes.name;
      delete event.relations.user;
      return event;
    });
    utils.sendResponse(trimmed,res);
  });
};

function getOne(req, res) {
  Event.where({id:req.params.id}).fetch({
      withRelated: ['user','rating']
    }).then(function (record) {
      utils.sendResponse(record,res);
  });
};

function addOne(req, res) {
  // TODO: if (!req.body.coords) -> Make util call for address string from coords.lat,coords.lng;
  // TODO: add result of above operation to req.body/query for addEventRecord call
  utils.addEventRecord(req.query,res);
};

function getLocal(req, res) {
  Event.query(function(qb){

    //two dates are used to get modified
    var date1 = new Date();
    var date2 = new Date();

    //currentTime is used to keep track of current time
    var currentTime = new Date();

    //beginningDate to current date at 3 a.m.
    date1.setHours(3, 0, 0, 0);
    var beginningDate = date1.toISOString();

    //endingDate to next day at 3 a.m.
    date2.setDate(date1.getDate() + 1);
    date2.setHours(3, 0, 0, 0);
    var endingDate = date2.toISOString();

    //Narrows down events based on specified location
    qb.whereBetween('lat', [req.query.lat1,req.query.lat2]);
    qb.whereBetween('lng', [req.query.lng1,req.query.lng2]);

    //Narrows down events within specified ISO8601 time
    qb.where('startTime', '<', endingDate).andWhere('endTime', '>', beginningDate);
    qb.where('endTime', '>', currentTime);

  })
  .fetchAll({
     withRelated: ['user','rating']
  }).then(function (record) {
    utils.sendResponse(record,res);
  });
};


/************** Kimono API functions ******************/

//this function expects a large JSON object of events, that will be sent
//periodically by a Kimono Labs scraper.  Function will parse the events
//and add them to our DB.
function fetchBatchDataFromKimonoAPI() {
  request('https://www.kimonolabs.com/api/9djxfaym?apikey=' + process.env.KIMONO_API_KEY);
  .then(function(res){
    console.log('response received from kimono');
    var events = JSON.parse(res[0].body).results.collection1;
    var throttledAddEventFromKimono = utils.makeThrottledFunction(addEventFromKimono,2000);
    for (var i = 0; i < events.length; i++) {
      throttledAddEventFromKimono(events[i]);
    };
  });
};

function addEventFromKimono(event){
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
        params.title = event.title;
        utils.sendGoogleAPIRequest(event.address.text)
          .then(function(res){
            
            coordinates = utils.getCoordinatesFromGoogleAPIResponse(res);
            params.lat = coordinates[0];
            params.lng = coordinates[1];
            
            startEndTimes = utils.getStartEndTimes(event.date.text,event.duration.text);
            params.startTime = startEndTimes[0];
            params.endTime = startEndTimes[1];

            utils.addEventRecord(params);
          });
      } else {
        console.log('event already exists in DB; skipping');
      }
   });
  }
};


/************** Eventbrite API functions ******************/


function fetchBatchDataFromEventbriteAPI(){
  console.log('req received at eventbrite endpoint!');
  var throttledFetchPageFromEventbriteAPI = utils.makeThrottledFunction(fetchPageFromEventbriteAPI,5000);
  var reqUrl = 'https://www.eventbriteapi.com/v3/events/search/?token=' 
               + process.env.EVENTBRITE_API_TOKEN 
               + '&start_date.keyword=today&venue.country=US';
  request(reqUrl)
  .then(function (res) {
    var pages = JSON.parse(res[0].body).pagination.page_count;
    console.log('initial package received from eventbrite... beginning batch fetch. ' + pages + ' total pages to fetch.');
    
    for (var i = 1; i <= pages; i++) {
      throttledFetchPageFromEventbriteAPI(reqUrl, i);
    };
  });
}



function fetchPageFromEventbriteAPI(reqUrl,pageNumber){
  console.log("fetching page " + pageNumber);
  request(reqUrl + '&page=' + pageNumber)
  .then(function (res) {
    var body = JSON.parse(res[0].body);
    body.events.forEach(function(event){
      Event.where({title:event.name.text}).fetch().then(function (record) {
        if(!record){
          utils.addEventRecord({
            title: event.name.text,
            lat: event.venue.latitude,  
            lng: event.venue.longitude,
            startTime: event.start.utc,
            endTime: event.end.utc,
            info: (event.description.text ? event.description.text.slice(0,2000) : '')
            //TODO: user_id should be a special account reserved for Eventbrite_bot
            //TODO: do something better than a title match for preventing duplicate entries
          });
        } else {
          console.log("event with that title already exists; skipping.")
        }
      });
    });
  })
};




