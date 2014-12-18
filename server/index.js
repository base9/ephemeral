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

var port = 9000;
app.listen(port);
console.log('app listening on localhost:' + port);

// expose app 
module.exports = app;