//this will alter the global object 'Date'
// require('./date.js');

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Event = require('./events.model.js');


module.exports = {
  sendResponse: sendResponse,
  formatAndTrimEventRecords: formatAndTrimEventRecords,
  getPopularity: getPopularity
};


function sendResponse(record, res){
  if(record){
    res.json(record);
  } else {
    res.status(404).end();
  }
}



function formatAndTrimEventRecords(collection){
  var trimmed = collection.map(function(event){
    if(event.relations && event.relations.rating){
      
      //THESE LINES DEPRECATED: ratings table not in use.
      // event.attributes.ratings = event.relations.rating.length;
      delete event.relations.rating;
    }
    if(event.relations && event.relations.user){
      event.attributes.creator = event.relations.user.attributes.name;
      delete event.relations.user;
    }
    event.attributes.popularity = getPopularity(event.attributes.ratings);
    return event;
  });
  return trimmed;
}

//accepts a rating integer and converts it to a scale of 1-5.
//(somewhat arbitrarily)
function getPopularity(rating){
  var popularity = Math.ceil(rating / 20);
  popularity = Math.max(popularity, 1);
  popularity = Math.min(popularity, 5);
  return popularity;
}



