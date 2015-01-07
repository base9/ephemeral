// npm dependencies
var express  = require('express');
var passport = require('passport');

//load api keys from local file when in local dev environment.
if(!process.env.PORT){
  require('../api_keys.js');
}

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

app.listen(process.env.PORT || 9000);
console.log('app listening on port:' + (process.env.PORT || 9000));


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



// expose app 

module.exports = app;

//how SHOULD it work?  creating an event or a user should return that ID.  
