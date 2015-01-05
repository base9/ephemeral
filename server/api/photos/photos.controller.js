//helpful: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html

var controller = module.exports;
var request = require('request');
var Photo = require('./photos.model.js');
var seed = require('./photos.seed.js');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var fs = require('fs');

//sets up key and secret as env variables from a file that is .gitignored.
require('./aws_keys.js');


controller.getOne = function(req, res) {
//DEPRECATED.  photo get requests should go directly to S3, not through our server.
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
//DEPRECATED.  photo get requests should go directly to S3, not through our server.
  Photo.fetchAll({
      withRelated: ['user']
    }).then(function (collection) {
    res.json(collection);
  });
};


//POSTING A PHOTO: intended process
//client sends a GET to api/phots/addnew.  includes user id, event name, file extension, other details.
//server creates an entry in photos table. generates and returns presigned S3 URL to client.
//client then uses presigned URL to upload the photo to S3.
//if successful upload: just say 'photo uploaded!'
//if error: notify client that upload failed, and notify server so it can drop that recently created record.

//TODO: photo bucket currently allows anonymous read/write access.  refactor this.
//should allow credentialed read-write access (for dev environment - have api keys cached on dev machine)

//images can be viewed by the client very simply, like this: 
//<img src='https://s3-us-west-1.amazonaws.com/base9photos/UNIQUE_FILE_NAME.jpg'></img>

controller.s3GetTest = function(){
  console.log('s3 request received');
  var fileName = 'calvin.jpg';
  var params = {Bucket: 'base9photos', Key: fileName};
  var file = require('fs').createWriteStream(fileName);
  s3.getObject(params).createReadStream().pipe(file)
  .on('finish',function(){
    console.log('download complete of ' + fileName);
  });
}

controller.s3PostTest = function(){
  console.log('s3 post request received');
  var fs = require('fs');
  var zlib = require('zlib');
  var fileName = 'ch.jpg';

  var body = fs.createReadStream(fileName).pipe(zlib.createGzip());
  var s3obj = new AWS.S3({params: {Bucket: 'base9photos', Key: 'ch.zip'}});
  s3obj.upload({Body: body}).
    on('httpUploadProgress', function(evt) { console.log(evt); }).
    send(function(err, data) { console.log(err, data) });
}


controller.s3SignedPostTest = function(req,res){
  console.log('req received for signed PUT url')
  var params = {Bucket: 'base9photos', Key: 'aNewFile.jpg'};
  var url = s3.getSignedUrl('putObject', params);
  console.log("The URL is", url);
  res.json(url);
  fs.createReadStream('candles.jpg').pipe(request.put(url));
}











