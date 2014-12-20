var controller = module.exports;
var User = require('./user.model.js');
var seed = require('./user.seed.js');

//returns all users (for now).
controller.index = function(req, res) {
  User.fetchAll({
    }).then(function (collection) {
    res.json(collection.toJSON());
  });
};