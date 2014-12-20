var controller = module.exports;
var User = require('./users.model.js');
var seed = require('./users.seed.js');

controller.getOne = function(req, res) {
  User.where({id:req.params.id}).fetch()
  .then(function (user) {
      if(user){
        res.json(user);
      } else {
        res.status(404).end();
      }
  });
};

controller.getAll = function(req, res) {
  User.fetchAll({
    }).then(function (collection) {
      res.json(collection);
  });
};
