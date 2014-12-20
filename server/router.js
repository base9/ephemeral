var express = require('express');
var eventRouter = require('./api/event');
var userRouter = require('./api/user');
var photoRouter = require('./api/photo');
var ratingRouter = require('./api/rating');

module.exports = function ( app ) {
  // router
  app.use('/api/events', eventRouter);
  app.use('/api/user', userRouter);
  app.use('/api/photo', photoRouter);
  app.use('/api/rating', ratingRouter);

  // static
  // app.use(express.static(__dirname + '/../client'));
  app.use(express.static(__dirname + '/../ionic/www'));
}