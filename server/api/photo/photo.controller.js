var controller = module.exports;
var Photo = require('./photo.model.js');
var seed = require('./photo.seed.js');


controller.getOne = function(req, res) {
  Photo.where({id:req.params.id}).fetch({
      withRelated: ['user']
    }).then(function (photo) {
      if(photo){
        res.json(photo);
      } else {
        res.status(404).end();
      }

  });
};

controller.getAll = function(req, res) {
  Photo.fetchAll({
      withRelated: ['user']
    }).then(function (collection) {
    res.json(collection);
  });
};