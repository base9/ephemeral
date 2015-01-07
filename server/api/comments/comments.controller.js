var Comment = require('./comments.model.js');


module.exports = {
  addOne: addOne
};

function addOne(req, res) {
  var newComment = new Comment({
    user_id: req.body.user_id,
    event_id: req.body.event_id,
    comment: req.body.comment
  })
  .save()
  .then(function(){
    console.log('added new comment');
    res.status(201).end();
  });
}
