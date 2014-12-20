var controller = module.exports;
var Rating = require('./rating.model.js');
var seed = require('./rating.seed.js');

controller.index = function(req, res) {
  Rating.fetchAll({
      withRelated: ['user']  //TODO: could also include related 'event' here, but was getting an error...
    }).then(function (collection) {
    res.json(collection.toJSON());
  });
};