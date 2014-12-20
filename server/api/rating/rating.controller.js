var controller = module.exports;
var Rating = require('./rating.model.js');
var seed = require('./rating.seed.js');

controller.getOne = function(req, res) {
  Rating.where({id:req.params.id}).fetch({
      withRelated: ['user']
    }).then(function (rating) {
      if(rating){
        res.json(rating);
      } else {
        res.status(404).end();
      }
  });
};

controller.getAll = function(req, res) {
  Rating.fetchAll({
      withRelated: ['user']  //TODO: could also include related 'event' here, but was getting an error...
    }).then(function (collection) {
    res.json(collection);
  });
};