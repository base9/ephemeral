var express = require('express');
var bodyParser = require('body-parser');
var morgan  = require('morgan');

module.exports = {
  express: expressMiddleware
}

function expressMiddleware (app) {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(morgan('dev'));
}