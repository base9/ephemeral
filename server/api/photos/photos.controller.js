//helpful: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html

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

module.exports = {
  addOne: addOne,
  deleteOne: deleteOne
};

function addOne(req,res){
  new Photo(req.query)
  .save()
  .then(function(record){
    var fileName = record.attributes.id.toString();
    var params = {Bucket: 'base9photos', Key: fileName + '.jpg'};
    var url = s3.getSignedUrl('putObject', params);
    res.json(url);
  });
}

//deletes a photo record from the DB, if it exists and the request
//is coming from that photo's owner. does NOT do anything to 
//remove the photo from the S3 server!
function deleteOne(req,res){
  Photo.where({id:req.params.id}).fetch({
    }).then(function (record) {
      
      //delete the record
      if(record && record.user_id===req.params.user_id){
        record.destroy()
        .on('destroyed',function(){
          res.status(204).end();
        });
      //unauthorized
      } else if(record) {
        res.status(403).end();
      
      //record not found
      } else {
        res.status(404).end();
      }
  });
};








