var express = require('express');
var eventRouter = require('./api/event');

module.exports = function ( app ) {
  // router
  app.use('/api/events', eventRouter);

  // static
  // app.use(express.static(__dirname + '/../client'));
  app.use(express.static(__dirname + '/../ionic/www'));
}