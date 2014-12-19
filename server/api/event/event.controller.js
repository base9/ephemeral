var controller = module.exports;
var Event = require('./event.model.js');
var seed = require('./event.seed.js');

//hardcoded to return all events right now.
//just as a simple test
controller.index = function(req, res) {
  Event.fetchAll({
      withRelated: ['user']
    }).then(function (collection) {
    res.json(collection.toJSON());
  });
};