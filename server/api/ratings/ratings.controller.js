var Rating = require('./ratings.model.js');
var Event = require('../events/events.model.js');

module.exports = {
  updateRating: updateRating
};

function updateRating(req, res) {
  var updateValue;
  console.log ("RATING REQ.BODY: ", req.body)
  req.body.addSubtract === 'subtract' ? updateValue = -1 : updateValue = 1;
  Event.where({id:req.body.event_id}).fetch()
    .then(function(record){
      if(record){
        record.save({ratings: record.attributes.ratings + updateValue}, {patch: true});
        console.log('added new rating');
        res.status(201).end('rating added.');
      } else {
        res.status(404).end('no event by that id');
      }
    });
}
