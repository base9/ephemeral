var Rating = require('./ratings.model.js');
var Event = require('../events/events.model.js');

module.exports = {
  addOne: addOne
};

function addOne(req, res) {
  
  // DEPRECATED: not using ratings table; just increment the event property instead
  // var newRating = new Rating({
  //   user_id: req.body.user_id,
  //   event_id: req.body.event_id
  // })
  // .save();

  Event.where({id:req.body.event_id}).fetch()
    .then(function(record){
      if(record){
        record.save({ratings: record.attributes.ratings + 1}, {patch: true});
        console.log('added new rating');
        res.status(201).end('rating added.');
      } else {
        res.status(404).end('no event by that id');
      }
    });
      
  //   var fileName = makeHash(24) + '.jpg';
  //   var params = {Bucket: S3_BUCKET_NAME, Key: fileName};
  //   var photoUrl = 'https://' + S3_BUCKET_NAME + '.s3-' + process.env.AWS_REGION + '.amazonaws.com/' + fileName;
  //   var signedUrl = s3.getSignedUrl('putObject', params);
  //   record.save({url: photoUrl}, {patch: true});
  //   res.status(201).json(signedUrl);

}
