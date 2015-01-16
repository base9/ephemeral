//helpful: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html

var request = require('request');
var Photo = require('./photos.model.js');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var fs = require('fs');
var S3_BUCKET_NAME = 'base9photos';
var crypto = require('crypto');


//POSTING A PHOTO: intended process


//Option 1: authenticated uploads only
  //client sends a GET to api/phots/addnew.  includes user id, event name, file extension, other details.
  //server creates an entry in photos table. generates and returns presigned S3 URL to client.
  //client then uses presigned URL to upload the photo to S3.
  //if successful upload: just say 'photo uploaded!'
  //if error: notify client that upload failed, and notify server so it can drop that recently created record.



//Option 2: anyone can upload photos.
  //client generates its own hashed filename, e.g. 'FEaef873SJF.jpg'
  //uploads photo to S3 with that filename
  //POSTs to our server with the filename, event id, and user id so that server knows about that photo


//uploading photos while posting a new event:
  //wait until user clicks 'create event' to add photo to S3?  
  //or upload immediately when they add photo to the New Event window?  <---- this is simpler.
     //form submission would then include the filename of photo that has already been pushed to S3.


//TODO: photo bucket currently allows anonymous read/write access.  refactor this.
//should allow credentialed read-write access (for dev environment - have api keys cached on dev machine)
//'When deploying, you should change the ‘AllowedOrigin’ to only accept requests from your domain.''

//images can be viewed by the client very simply, like this: 
//<img src='https://s3-us-west-1.amazonaws.com/base9photos/UNIQUE_FILE_NAME.jpg'></img>




/* S3 bucket policy:
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "Stmt1420487341628",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::base9photos/*"
    }
  ]
}


*/


module.exports = {
  addOne: addOne,
  deleteOne: deleteOne,
  getUploadParams: getUploadParams
};


//expects req.body to have the following properties: user_id, event_id, and url.
function addOne(req,res){
  console.log('creating new photo record with these parameters:', req.body);
  new Photo(req.body)
   .save();
  res.status(201).end();
}



function getUploadParams(req,res){
  var policy = {
    "expiration": "2016-01-01T00:00:00Z",
    "conditions": [ 
      {"bucket": "base9photos"}, 
      ["starts-with", "$key", ""],
      {"acl": "private"},
      // {"success_action_redirect": "https://s3-us-west-1.amazonaws.com/base9photos/testupload1.jpg"},
      ["starts-with", "$Content-Type", ""],
      ["content-length-range", 0, 3130576]
    ]
  };
   
  var policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
   
  var signature = crypto.createHmac('sha1', process.env.AWS_SECRET_ACCESS_KEY).update(policyBase64).digest('base64');

  res.json({
    bucket: 'base9photos', 
    awsKey: process.env.AWS_ACCESS_KEY_ID, 
    policy: policyBase64, 
    signature: signature
  });


  //RE-IMPLEMENT THIS LATER? This code block is for generating S3 presigned URLs.
  //
  // .then(function(record){
  //   var fileName = makeHash(24) + '.jpg';
  //   var params = {Bucket: S3_BUCKET_NAME, Key: fileName};
  //   var photoUrl = 'https://' + S3_BUCKET_NAME + '.s3-' + process.env.AWS_REGION + '.amazonaws.com/' + fileName;
  //   var signedUrl = s3.getSignedUrl('putObject', params);
  //   record.save({url: photoUrl}, {patch: true});
  //   res.status(201).json(signedUrl);
  // });


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
}

