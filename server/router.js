var express = require('express');
var eventRouter = require('./api/event');

module.exports = function ( app ) {
  app.use('/api/events', eventRouter);

  // static
  app.use(express.static(__dirname + '/../client'));
}