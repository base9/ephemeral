///////////////////////Environment settings/////////////////////////
// TODO: env settings in another file
// load api keys from local file when in local dev environment.
if(process.env.MODE !== 'prod'){
  require('../api_keys.js');
}
console.log('Running in >>>>>', process.env.MODE, 'mode');
 
// detect dev mode
// TODO: separate this to dev config
if (process.env.MODE !== 'prod' && process.env.MODE !== 'test') {
  process.env.MODE = 'dev';
}

console.log('Running in >>>>>', process.env.MODE, 'mode');
 
// assign ports for dev and test modes
var localPort = {
  dev: 9000,
  test: 9001
};
///////////////////////////////////////////////////////////////////////

// npm dependencies
var express  = require('express');
var passport = require('passport');

// file dependencies
var config = require('./config/middleware');
var router = require('./router');

var app = express();

require('./config/passport')(passport);

// run app through config
config.express(app);

//run passport through config
config.passport(app, passport);

// use router for app
router(app, passport);

// expose http wrapped app as server to enable closing the server programmatically 
var server = app.listen(process.env.PORT || localPort[process.env.MODE]);
console.log('app listening on port:' + (process.env.PORT || localPort[process.env.MODE]));


///////////////////////////////////////////////////////////////////////
setTimeout(function(){
  var userSeed = require('./api/users/users.seed.js');
},400);

setTimeout(function(){
  var eventSeed = require('./api/events/events.seed.js');
},600);

setTimeout(function(){
  var ratingSeed = require('./api/ratings/ratings.seed.js');
},800);

setTimeout(function(){
  var commentSeed = require('./api/comments/comments.seed.js');
},1000);
///////////////////////////////////////////////////////////////////////


// expose app and server
module.exports = {
  app: app,
};
if (server) {
  module.exports.server = server;
}
