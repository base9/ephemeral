var controller = module.exports;
var Event = require('./event.model.js');
var seed = require('./event.seed.js');

//returns all events (for now).
controller.index = function(req, res) {
  Event.fetchAll({
      withRelated: ['user','rating']
    }).then(function (collection) {
    res.json(collection.toJSON());
  });
};