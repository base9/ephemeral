var Rating = require('./ratings.model.js');


module.exports = {
  addOne: addOne
}

function addOne(req, res) {
  var newRating = new Rating({
    user_id: req.body.user_id,
    event_id: req.body.event_id
  })
  .save();
  console.log('added new rating');
  res.status(201).end();
}
