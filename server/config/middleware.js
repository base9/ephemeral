var express    = require('express');
var session    = require('express-session');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var flash      = require('connect-flash');

module.exports = {
  express: expressMiddleware,
  passport: passportMiddleware
};

function expressMiddleware (app) {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(morgan('dev'));
}

function passportMiddleware(app, passport) {
	// required for passport
	app.use(session({ secret: 'secret' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash());
}