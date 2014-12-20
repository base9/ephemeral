var controller = module.exports;
var User = require('./user.model.js');
var seed = require('./user.seed.js');

//hardcoded to return all events right now.
//just as a simple test
controller.index = function(req, res) {
  User.fetchAll({

    }).then(function (collection) {
    res.json(collection.toJSON());
  });
};