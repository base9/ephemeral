var controller = module.exports;
var Photo = require('./photos.model.js');
var seed = require('./photos.seed.js');
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-1';

//sets up key and secret as env variables from a file that is .gitignored.
require('./aws_keys.js');


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

controller.s3test = function(){
  console.log('s3 request received')
  var s3 = new AWS.S3();
  var params = {Bucket: 'base9photos', Key: 'calvin.jpg'};
  var file = require('fs').createWriteStream('calvin.jpg');
  s3.getObject(params).createReadStream().pipe(file)
  .on('finish',function(thing1,thing2){
    console.log('download complete.');
  });
}