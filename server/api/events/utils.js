//this will alter the global object 'Date'
// require('./date.js');

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Event = require('./events.model.js');


module.exports = {
  sendResponse: sendResponse,
  getPopularity: getPopularity
};


function sendResponse(record, res){
  if(record){
    res.json(record);
  } else {
    res.status(404).end();
  }
}



//accepts a rating integer and converts it to a scale of 1-5.
//(somewhat arbitrarily)
function getPopularity(rating){
  var popularity = Math.ceil(rating / 20);
  popularity = Math.max(popularity, 1);
  popularity = Math.min(popularity, 5);
  return popularity;
}



