var Event = require('./events.model.js');
var seed = require('./events.seed.js');
var controller = module.exports;

controller.getAll = function(req, res) {
  Event.fetchAll({
      withRelated: ['user','rating']
    }).then(function (collection) {
    res.json(collection);
  });
};

controller.getOne = function(req, res) {
  Event.where({id:req.params.id}).fetch({
      withRelated: ['user','rating']
    }).then(function (event) {
      if(event){
        res.json(event);
      } else {
        res.status(404).end();
      }
  });
};

controller.addOne = function(req, res) {
  var newEvent = new Event(req.body)
  .save()
  .then(function(){
    console.log('added new event: ' + req.body.title);
    res.status(201).end();
  });
};

controller.getLocal = function(req, res) {
  Event.query(function(qb){
    qb.whereBetween('lat', [req.query.lat1,req.query.lat2]);
    qb.whereBetween('lng', [req.query.lng1,req.query.lng2]);
  })
  .fetchAll({
     withRelated: ['user','rating']
  }).then(function (event) {
    if(event){
      res.json(event);
    } else {
      res.status(404).end();
    }
  });
};
