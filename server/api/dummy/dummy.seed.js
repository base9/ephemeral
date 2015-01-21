var Event = require('../events/events.model.js');
var Photo = require('../photos/photos.model.js');
var Rating = require('../ratings/ratings.model.js');
var Comment = require('../comments/comments.model.js');
var User = require('../users/users.model.js');
var S3_BUCKET_NAME = 'base9photos';

setTimeout(addDummyUser, 200);

setTimeout(addAllDummyEvents,300);

setTimeout(addDummyPhotosAndCommentsForPillowFight, 600);


//feel free to extend this array.  note that ID is just a random big number you can make up for each event.
var dummies = [
    {
        "id": 9482346,
        "lat": "37.7837142000",
        "lng": "-122.4091214000",
        "title": "Care for foster puppies",
        "startTime": "1421769648000",
        "endTime": "1421812848000",
        "ratings": 30,
        "price": 0,
        "url": null,
        "info": null,
        "category": "culture",
        "streetAddress1": "948 Market Street",
        "streetAddress2": null,
        "city": "San Francisco",
        "state": "CA",
        "zipCode": null
    },
    {
        "id": 139481,
        "lat": "37.7745470000",
        "lng": "-122.4587020000",
        "title": "Ultimate frisbee tournament",
        "startTime": "1421722846000",
        "endTime": "1421816446000",
        "ratings": 85,
        "price": 0,
        "url": null,
        "info": null,
        "category": "fitness",
        "streetAddress1": "2500 Fulton Street",
        "streetAddress2": null,
        "city": "San Francisco",
        "state": "CA",
        "zipCode": null,
    },
    {
        "id": 1396836,
        "lat": "37.7781543000",
        "lng": "-122.4060684000",
        "title": "Miniature Elves polishing",
        "startTime": "1421722835000",
        "endTime": "1421816435000",
        "ratings": 1,
        "price": 0,
        "url": null,
        "info": null,
        "category": "hobbies",
        "streetAddress1": "100 Harriet Street",
        "streetAddress2": null,
        "city": "San Francisco",
        "state": "CA",
        "zipCode": null
    },
    {
        "id": 9675746,
        "lat": "37.7699614000",
        "lng": "-122.4391804000",
        "title": "Birdwatching",
        "startTime": "1421809201000",
        "endTime": "1421816401000",
        "ratings": 35,
        "price": 0,
        "url": null,
        "info": null,
        "category": "outdoors",
        "streetAddress1": "100 Buena Vista Avenue Eas",
        "streetAddress2": null,
        "city": "San Francisco",
        "state": "CA",
        "zipCode": null
    },
    {
        "id": 9834579,
        "lat": "37.7891936000",
        "lng": "-122.4204999000",
        "title": "Moe's pub crawl",
        "startTime": "1421722831000",
        "endTime": "1421816431000",
        "ratings": 20,
        "price": 0,
        "url": null,
        "info": null,
        "category": "drink",
        "streetAddress1": "100 Austin Street",
        "streetAddress2": null,
        "city": "San Francisco",
        "state": "CA",
        "zipCode": null
    },
    {
        "id": 68299,
        "lat": "37.8015558000",
        "lng": "-122.3975488000",
        "title": "Help kids at the Exploratorium",
        "startTime": "1421680545000",
        "endTime": "1421817345000",
        "ratings": 40,
        "price": 0,
        "url": null,
        "info": null,
        "category": "culture",
        "streetAddress1": "Pier 15",
        "streetAddress2": null,
        "city": "San Francisco",
        "state": "CA",
        "zipCode": null
    },
    {
       "id": 2879358,
        "lat": "37.7909882000",
        "lng": "-122.4024118000",
        "title": "Super zumba classes",
        "startTime": "1421723738000",
        "endTime": "1421817338000",
        "ratings": 65,
        "price": 0,
        "url": null,
        "info": null,
        "category": "fitness",
        "streetAddress1": "200 Montgomery Street",
        "streetAddress2": null,
        "city": "San Francisco",
        "state": "CA",
        "zipCode": null
    },
    {
        "id": 2348724,
        "user_id": null,
        "lat": "37.7960169000",
        "lng": "-122.3960102000",
        "title": "All-day Outdoor Pillowfight",
        "startTime": "1421680519000",
        "endTime": "1437448519000",
        "ratings": 95,
        "price": 0,
        "url": null,
        "info": 'Bespoke pork belly Helvetica, fanny pack craft beer DIY heirloom banjo church-key yr. Williamsburg viral trust fund whatever. Mumblecore fashion axe sustainable salvia. Etsy meggings leggings, post-ironic Williamsburg occupy sartorial semiotics Blue Bottle lumbersexual cronut Truffaut ugh asymmetrical. Locavore YOLO wayfarers Wes Anderson skateboard, tilde quinoa. Quinoa ennui forage gentrify, cred Shoreditch sartorial chillwave asymmetrical master cleanse hella synth vegan typewriter. Bushwick shabby chic pop-up chia organic literally.Single-origin coffee chia aesthetic tousled cronut. XOXO gentrify twee tofu craft beer, try-hard butcher. Sriracha Pitchfork biodiesel, post-ironic disrupt butcher Neutra vinyl you probably havent heard of them bespoke swag messenger bag. Tofu gentrify small batch, migas salvia Echo Park whatever master cleanse narwhal normcore Odd Future. Fixie post-ironic mixtape Helvetica Williamsburg semiotics, Marfa cred pour-over. Tumblr tousled taxidermy next level art party bicycle rights. Typewriter craft beer put a bird on it blog Carles leggings.',
        "category": "outdoors",
        "streetAddress1": "Sue Bierman Park",
        "streetAddress2": null,
        "city": "San Francisco",
        "state": "CA",
        "zipCode": null
    }
];


function addDummyUser(){
  User.where({name:'Steve Erwin'}).fetch()
   .then(function (user) {
    if(!user){  
      var newUser = new User({    
        name: 'Steve Erwin',    
        email: 'steve@outbackadventures.com',
        bio: 'global explorer and animal lover'
      })
      .save()
      .then(function(user){
        console.log('added dummy user');
      });
    }
  });
}

function addAllDummyEvents(){
  dummies.forEach(function(dummy){
    Event.where({id:dummy.id}).fetch().then(function(event){
      if(event){
        return;
      }
      new Event().save(dummy,{method:"insert"})
      console.log("added dummy event:", dummy.title);
      });
  });
}

function addDummyPhotosAndCommentsForPillowFight(){
  Event.where({title:'All-day Outdoor Pillowfight'}).fetch({withRelated: ['comments']})
    .then(function(event){
      if(!event || (event.relations && event.relations.comments.length)){
        return;
      }

      var eventId = event.attributes.id;
      console.log('dummy event created with id of ', eventId);
      
      setTimeout(function(){
        addDummyPhoto(eventId,'pillowdummy1');
      },100);          

      setTimeout(function(){
        addDummyPhoto(eventId,'pillowdummy2');
      },200);

      setTimeout(function(){
        addDummyPhoto(eventId,'pillowdummy3');
      },300);

      setTimeout(function(){
        addDummyPhoto(eventId,'pillowdummy4');
      },400);
      
      setTimeout(function(){
        addDummyPhoto(eventId,'pillowdummy5');
      },500);

      new Comment({
        event_id: event.id,
        comment: 'Most fun I\'ve had in ages!'
      })
      .save();

      new Comment({
        event_id: event.id,
        comment: "Yeah, but are these feathers organic? It's really important that this event is sustainable and that the geese and ducks who gave their lives for these feather pillows had happy lives before becoming ammunition at this crazy pillowfight."
      })
      .save();

      new Comment({
        event_id: event.id,
        comment: "HYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARRRRRRRGHH!"
      })
      .save();

      new Comment({
        event_id: event.id,
        comment: "Feathers. So many feathers.  Everywhere.  I can't even."
      })
      .save();
      
      console.log('added dummy comments for pillowfight event');
    });
}


function addDummyPhoto(eventId, slug){
  var fileName = slug + '.jpg';
  var params = {Bucket: S3_BUCKET_NAME, Key: fileName};
  var photoUrl = 'https://' + S3_BUCKET_NAME + '.s3-' + process.env.AWS_REGION + '.amazonaws.com/' + fileName;
  
  new Photo({event_id:eventId ,url: photoUrl})
  .save()
  .then(function(record){
    console.log('added dummy photo', fileName);
  });
}




