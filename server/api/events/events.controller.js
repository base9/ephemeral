
var Event = require('./events.model.js');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var utils = require('./utils.js');
var crontab = require('node-crontab');


/****************** scheduled function calls *****************/

//these scrapers run 5x a day, at 12:01, 4:01, 8:01, etc
var cronJob = crontab.scheduleJob("1 */4 * * *", function () {
  console.log("****************it's cron time!******************");
  fetchBatchDataFromEventbriteAPI();
  fetchBatchDataFromKimonoAPI();
});


/********************* Module.exports *************************/

module.exports = {
  getAll: getAll,
  getOne: getOne,
  addOne: addOne,
  getLocal: getLocal,
  fetchBatchDataFromKimonoAPI: fetchBatchDataFromKimonoAPI,
  fetchBatchDataFromEventbriteAPI: fetchBatchDataFromEventbriteAPI,
  getCoordsFromAddress: getCoordsFromAddress,
  getAddressFromCoords: getAddressFromCoords
};

/******************** Generic DB interactions **********************/

function getAll(req, res) {
  Event.fetchAll({
      withRelated: ['user','rating']
  }).then(function (collection) {
    utils.sendResponse(utils.formatAndTrimEventRecords(collection),res);
  });
}

function getOne(req, res) {
  Event.where({id:req.params.id}).fetch({
      withRelated: ['user','rating','photos']
    }).then(function (record) {
      utils.sendResponse(utils.formatAndTrimEventRecords([record])[0],res);
  });
}

function addOne(req, res) {

  // TODO: if (!req.body.coords) -> Make util call for address string from coords.lat,coords.lng;
  // TODO: add result of above operation to req.body/query for addEventRecord call
  console.log("Sending New Post to Database: ",req.body);
  utils.addEventRecord(req.body, res);
}

function getLocal(req, res) {
  Event.query(function(qb){

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

    console.log("RANGE", beginningDate, endingDate, "CURRENT TIME", currentTime);

    //Narrows down events based on specified location
    qb.whereBetween('lat', [req.query.lat1,req.query.lat2]);
    qb.whereBetween('lng', [req.query.lng1,req.query.lng2]);

    //Narrows down events within specified ISO8601 time
    qb.where('startTime', '<', endingDate)
      .andWhere('endTime', '>', beginningDate)
      .andWhere('endTime', '>', currentTime)
      .orWhere('endTime', null);

  })
  .fetchAll({
     withRelated: ['user','rating']
  }).then(function (collection) {
    utils.sendResponse(utils.formatAndTrimEventRecords(collection),res);
  });
}


/************** Geocoding ******************/

function getCoordsFromAddress(req,res) {
  console.log("REVERSE GEOCODE REQUEST ADDRESS: ", req.query.address);
  utils.geocodeGoogleAPIRequest(req.query.address)
    .then(function(response){  
      coordinates = utils.getCoordinatesFromGoogleAPIResponse(response);
      console.log("GOT COORDS FROM ADDRESS: ", coordinates);
      res.json(coordinates);
    });
}

function getAddressFromCoords(req,res) {
  console.log("REVERSE GEOCODE REQUEST QUERY: ", req.query);
  utils.reverseGeocodeGoogleAPIRequest(req.query)
    .then(function(response) {
      var addressParams = utils.parseGoogleAPIAddress(response);
      res.json(addressParams);
    });
}


/************** Kimono API functions ******************/

//this function expects a large JSON object of events, that will be sent
//periodically by a Kimono Labs scraper.  Function will parse the events
//and add them to our DB.
function fetchBatchDataFromKimonoAPI() {
  request('https://www.kimonolabs.com/api/9djxfaym?apikey=xlOwSDfkEN6XINU2tWxQhXPAec5Z9baZ')
  .then(function(res){
    console.log('response received from kimono');
    var events = JSON.parse(res[0].body).results.collection1; //split results and collection1 with if statements
    var throttledAddEventFromKimono = utils.makeThrottledFunction(addEventFromKimono,2000);
    for (var i = 0; i < events.length; i++) {
      throttledAddEventFromKimono(events[i]);
    }
  });
}

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

        utils.geocodeGoogleAPIRequest(event.address) //here is where the problem starts (should be event.address)
          .then(function(res){
            
            coordinates = utils.getCoordinatesFromGoogleAPIResponse(res);
            params.lat = coordinates[0];
            params.lng = coordinates[1];
            
            console.log("BEFORE: ", event.date.text, event.duration);
            startEndTimes = utils.getStartEndTimes(event.date.text,event.duration);
            params.startTime = startEndTimes[0];
            params.endTime = startEndTimes[1];
            console.log("AFTER: ", "START", params.startTime, "END", params.endTime);

            utils.addEventRecord(params);
          });
      } else {
        console.log('event already exists in DB; skipping');
      }
   });
  }
}


/************** Eventbrite API functions ******************/


function fetchBatchDataFromEventbriteAPI(){
  console.log('req received at eventbrite endpoint!');
  var throttledFetchPageFromEventbriteAPI = utils.makeThrottledFunction(fetchPageFromEventbriteAPI,5000);
  var reqUrl = 'https://www.eventbriteapi.com/v3/events/search/?token=WUETWTBHZAXVIQK46NZM&start_date.keyword=today&venue.country=US';
  request(reqUrl)
  .then(function (res) {
    var pages = JSON.parse(res[0].body).pagination.page_count;
    console.log('initial package received from eventbrite... beginning batch fetch. ' + pages + ' total pages to fetch.');
    
    for (var i = 1; i <= pages; i++) {
      throttledFetchPageFromEventbriteAPI(reqUrl, i);
    }
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
          console.log("event with that title already exists; skipping.");
        }
      });
    });
  });
}




