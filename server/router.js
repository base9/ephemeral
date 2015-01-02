var express      = require('express');
var eventRouter  = require('./api/events');
var userRouter   = require('./api/users');
var photoRouter  = require('./api/photos');
var ratingRouter = require('./api/ratings');

module.exports = function ( app ) {
  // router
  app.use('/api/events', eventRouter);
  app.use('/api/users', userRouter);
  app.use('/api/photos', photoRouter);
  app.use('/api/ratings', ratingRouter);

  // static
  // app.use(express.static(__dirname + '/../client'));
  // app.use('/bower_components', express.static(__dirname));
  app.use(express.static(__dirname + '/../ionic/www'));
}