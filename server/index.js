// npm dependencies
var express = require('express');

// file dependencies
var config = require('./config');
var router = require('./router');

var app = express();

// run app through config
config.express(app);

// use router for app
router(app);


app.listen(process.env.PORT || 9000)
console.log('app listening on localhost:' + 9000);

// expose app 
module.exports = app;