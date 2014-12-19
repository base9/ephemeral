var controller = module.exports;
var models = require('../../db/models.js');
var seed = require('./event.seed.js');

//hardcoded to return all events right now.
//just as a simple test
controller.index = function(req, res) {
  models.Event.fetchAll().then(function (collection) {
    res.json(collection.toJSON());
  });
};