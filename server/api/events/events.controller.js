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

 controller.addBatchDataFromKimonoAPI = function(req, res) {
   console.log('post req received at Kimono endpoint!');
   var events = JSON.parse(req.body.collection1);
   
   var recursiveAddEvents = function(events){
    var evnt = events.shift();
    console.log('************************************* EVENT: ');
    console.log(evnt);
    console.log('*************************************');
    Event.where({title:evnt.title}).fetch().then(function (record) {
      if(!record){
        //parse event address into a lat and lng
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
                console.log("LAT*****:", lat, "LNG****:", lng)
                var newEvent = new Event({
                  title: evnt.title,
                  lat: lat,  
                  lng: lng,
                  //parse event date/time into correct format. yikes.
                  startTime: evnt.startTime.text,
                  info: evnt.details.text ,

                  //user_id should be a special account reserved for SF_funcheap_bot
                })
                .save();
                console.log('added new event "' + evnt.title + '"');
              } else {
                console.log("address missing or bad request; no event added.")
              }
            }
          });
        };
    });
  if(events.length){
    setTimeout(recursiveAddEvents.bind(this,events),1000);
  }
 }
 recursiveAddEvents(events);
}


















