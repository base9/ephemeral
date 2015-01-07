var express       = require('express');
var eventRouter   = require('./api/events');
var userRouter    = require('./api/users');
var photoRouter   = require('./api/photos');
var ratingRouter  = require('./api/ratings');
var commentRouter = require('./api/comments');
var authRouter    = require('./auth');

module.exports = function (app, passport) {
  // router
  app.use('/api/events', eventRouter);
  app.use('/api/users', userRouter);
  app.use('/api/photos', photoRouter);
  app.use('/api/ratings', ratingRouter);
  app.use('/api/comments', commentRouter);
  
  // app.use('/auth', authRouter);
  app.post('/auth/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.post('/auth/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // static
  // app.use(express.static(__dirname + '/../client'));
  // app.use('/bower_components', express.static(__dirname));
  app.use(express.static(__dirname + '/../ionic/www'));
};