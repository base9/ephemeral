
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
  getAddressFromCoords: getAddressFromCoords,
  addManySpoofs: addManySpoofs
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
      withRelated: ['user','rating','photos', 'comments']
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
  .fetchAll({
     withRelated: ['user','rating']
  }).then(function (collection) {
    utils.sendResponse(utils.formatAndTrimEventRecords(collection),res);
  });
}

/************** Geocoding ******************/

//returns a promise of an http response.  parse the response like this:
//var coords = JSON.parse(res[0].body);
//coords will be a lat, lng tuple like [44.5, -122.67]
function getCoordsFromAddress(address) {
  console.log("GEOCODE REQUEST ADDRESS: ", address);
  return request('https://base9geocode.herokuapp.com/geo/geocode?address=' + address);
}

//returns a promise of an http response.  parse the response like this:
//var address = JSON.parse(res[0].body);
//'address' will be an object with fields like addressLine1, city, state, zipCode, etc.
function getAddressFromCoords(coords) {
  console.log("REVERSE GEOCODE REQUEST QUERY: ", coords);
  return request('https://base9geocode.herokuapp.com/geo/reverseGeocode?lat=' + coords[0] + '&lng=' + coords[1]);
}


/************** Kimono API functions ******************/

//this function expects a large JSON object of events, that will be sent
//periodically by a Kimono Labs scraper.  Function will parse the events
//and add them to our DB.
function fetchBatchDataFromKimonoAPI() {
  request('https://www.kimonolabs.com/api/9djxfaym?apikey=' + process.env.KIMONO_API_KEY)
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

        getCoordsFromAddress(event.address.text? event.address.text : event.address)
          .then(function(res){
            var coords = JSON.parse(res[0].body);
            params.lat = coords[0];
            params.lng = coords[1];
            
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

var categories = [];

function fetchBatchDataFromEventbriteAPI(){
  console.log('req received at eventbrite endpoint!');
  var throttledFetchPageFromEventbriteAPI = utils.makeThrottledFunction(fetchPageFromEventbriteAPI,1500);
  var reqUrl = 'https://www.eventbriteapi.com/v3/events/search/?token=' + process.env.EVENTBRITE_API_TOKEN + '&start_date.keyword=today&venue.country=US';
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
      console.log("**********EVENT************", event.venue.latitude);
      if (event.category === null) {
        event.category = {name: 'Other'};
      }
      categories.push(event.category.name);
      Event.where({title:event.name.text}).fetch().then(function (record) {
        if(!record){
          utils.addEventRecord({
            title: event.name.text,
            streetAddress1: event.venue.address.address_1,
            streetAddress2: (event.venue.address.address_2 ? event.venue.address.address_2 : ''),
            url: event.organizer.url,
            lat: event.venue.latitude,
            lng: event.venue.longitude,
            startTime: Date.parse(event.start.utc),
            endTime: Date.parse(event.end.utc),
            category: categoryFilter(event.category.name),
            price: (event.ticket_classes[0].free ? 0 : ((event.ticket_classes[0].cost.value / 100) + (event.ticket_classes[0].fee.value / 100))),
            info: ((event.description && event.description.text) ? event.description.text.slice(0,2000) : '')
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

function categoryFilter(eventCategory) {
  if (eventCategory === 'Sports & Fitness' || eventCategory === 'Health & Wellness') {
    eventCategory = 'fitness';
  } else if (eventCategory === 'Hobbies & Special Interest' || eventCategory === 'Home & Lifestyle') {
    eventCategory = 'hobbies';
  } else if (eventCategory === 'Music' || eventCategory === 'Film, Media & Entertainment' || eventCategory === 'Performing & Visual Arts') {
    eventCategory = 'entertainment';
  } else if (eventCategory === 'Community & Culture' || eventCategory === 'Charity & Causes') {
    eventCategory = 'culture';
  } else if (eventCategory === 'Food & Drink') {
    eventCategory = 'drink';
  } else if (eventCategory === 'Travel & Outdoor') {
    eventCategory = 'outdoors';
  } else {
    eventCategory = 'other';
  }
  return eventCategory;
}

