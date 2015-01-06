//helpful: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html

var controller = module.exports;
var request = require('request');
var Photo = require('./photos.model.js');
var seed = require('./photos.seed.js');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var fs = require('fs');


//POSTING A PHOTO: intended process
//client sends a GET to api/phots/addnew.  includes user id, event name, file extension, other details.
//server creates an entry in photos table. generates and returns presigned S3 URL to client.
//client then uses presigned URL to upload the photo to S3.
//if successful upload: just say 'photo uploaded!'
//if error: notify client that upload failed, and notify server so it can drop that recently created record.

//TODO: photo bucket currently allows anonymous read/write access.  refactor this.
//should allow credentialed read-write access (for dev environment - have api keys cached on dev machine)
//'When deploying, you should change the ‘AllowedOrigin’ to only accept requests from your domain.''

//images can be viewed by the client very simply, like this: 
//<img src='https://s3-us-west-1.amazonaws.com/base9photos/UNIQUE_FILE_NAME.jpg'></img>


controller.addOne = function(req,res){
  new Photo(req.query)
  .save()
  .then(function(record){
    var fileName = record.attributes.id.toString());
    var params = {Bucket: 'base9photos', Key: fileName + '.jpg'};
    var url = s3.getSignedUrl('putObject', params);
    res.json(url);
  });
}


//TODO: add controller.delete for removing photos - only allowed if user is photo owner.
//invoked automatically if initial upload to S3 fails.











