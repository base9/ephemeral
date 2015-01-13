var User = require('../users/users.model.js');
var Event = require('./events.model.js');
var Photo = require('../photos/photos.model.js');
var Rating = require('../ratings/ratings.model.js');
var Comment = require('../comments/comments.model.js');
var S3_BUCKET_NAME = 'base9photos';


setTimeout(function(){
  addDummyUserAndEvent();
},50);

function addDummyUserAndEvent(){
  User.where({name:'Steve Erwin'}).fetch().then(function (user) {
    if(!user){
      var newUser = new User({
        name: 'Steve Erwin',
        email: 'steve@outbackadventures.com',
        bio: 'global explorer and animal lover'
      })
      .save()
      .then(function(user){
        console.log('added dummy user');
        var userId = user.attributes.id;
        Event.where({title:'Free Bagels at 8pm'}).fetch().then(function (event) {
          if(!event){
            console.log('creating seed event now with ratings and photos...');
            var newEvent = new Event({
                title: 'Free Bagels at 8pm',
                startTime: 1420516800000,
                endTime: 1420524000000,
                lat: 37.7931290,
                lng: -122.394200,
                user_id: userId,
                info: 'Bespoke pork belly Helvetica, fanny pack craft beer DIY heirloom banjo church-key yr. Williamsburg viral trust fund whatever. Mumblecore fashion axe sustainable salvia. Etsy meggings leggings, post-ironic Williamsburg occupy sartorial semiotics Blue Bottle lumbersexual cronut Truffaut ugh asymmetrical. Locavore YOLO wayfarers Wes Anderson skateboard, tilde quinoa. Quinoa ennui forage gentrify, cred Shoreditch sartorial chillwave asymmetrical master cleanse hella synth vegan typewriter. Bushwick shabby chic pop-up chia organic literally.Single-origin coffee chia aesthetic tousled cronut. XOXO gentrify twee tofu craft beer, try-hard butcher. Sriracha Pitchfork biodiesel, post-ironic disrupt butcher Neutra vinyl you probably havent heard of them bespoke swag messenger bag. Tofu gentrify small batch, migas salvia Echo Park whatever master cleanse narwhal normcore Odd Future. Fixie post-ironic mixtape Helvetica Williamsburg semiotics, Marfa cred pour-over. Tumblr tousled taxidermy next level art party bicycle rights. Typewriter craft beer put a bird on it blog Carles leggings.',
                category: 'Party',
                streetAddress1: '1 Embarcadero Blvd',
                streetAddress2: 'Suite 101',
                city: 'San Francisco',
                state: 'CA',
                zipCode: '94102',
                price: 0

              })
              .save()
              .then(function(event){
                var eventId = event.attributes.id;
                setTimeout(function(){
                  addDummyPhoto(userId, eventId,'dummy1');
                },100);          

                setTimeout(function(){
                  addDummyPhoto(userId, eventId,'dummy2');
                },200);

                setTimeout(function(){
                  addDummyPhoto(userId, eventId,'dummy3');
                },300);

                setTimeout(function(){
                  addDummyPhoto(userId, eventId,'dummy4');
                },400);

                setTimeout(function(){
                  addDummyRating(userId,eventId);
                },190);

                setTimeout(function(){
                  addDummyRating(userId,eventId);
                },210);

                setTimeout(function(){
                  addDummyRating(userId,eventId);
                },220);

                setTimeout(function(){
                  addDummyRating(userId,eventId);
                },230);

                setTimeout(function(){
                  addDummyRating(userId,eventId);
                },240);

                setTimeout(function(){
                  addDummyRating(userId,eventId);
                },250);

                setTimeout(function(){
                  addDummyRating(userId,eventId);
                },260);

                new Comment({
                  user_id: 1,
                  event_id: event.id,
                  comment: 'omg so STALE!'
                })
                .save();

                new Comment({
                  user_id: 1,
                  event_id: event.id,
                  comment: "Mine had a hole in it, what's the deal???"
                })
                .save();

                new Comment({
                  user_id: 1,
                  event_id: event.id,
                  comment: "Bagels Bagels bagels bagels bagels bagels bagels bagels. I hate them so much. Why did I come here?"
                })
                .save();
                
                console.log('added dummy comments for bagel event');

              });
            }
        });
      });
    }
  });
}



function addDummyPhoto(userId, eventId, slug){
  new Photo({user_id:userId, event_id:eventId})
  .save()
  .then(function(record){
    var fileName = slug + '.jpg';
    var params = {Bucket: S3_BUCKET_NAME, Key: fileName};
    var photoUrl = 'https://' + S3_BUCKET_NAME + '.s3-' + process.env.AWS_REGION + '.amazonaws.com/' + fileName;
    //var signedUrl = s3.getSignedUrl('putObject', params);
    record.save({url: photoUrl}, {patch: true});
    console.log('added dummy photo');
    console.log(userId, eventId, fileName);
  });
}





function addDummyRating(userId,eventId){
  var newRating = new Rating({
    user_id: userId,
    event_id: eventId,
  })
  .save();
  console.log('added dummy rating');
}




