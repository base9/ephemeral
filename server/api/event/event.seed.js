var models = require('../../db/models.js');
var Event = require('./event.model.js');

setTimeout(function(){

  models.User.where({name:'Steve Erwin'}).fetch().then(function (user) {
    if(!user){
      var newUser = new models.User({
        name: 'Steve Erwin',
        email: 'steve@outbackadventures.com',
        bio: 'global explorer and animal lover',
      })
      .save();
      console.log('added dummy user "Steve Erwin"');
    }
  });

  Event.where({title:'SantaCon'}).fetch().then(function (event) {
    if(!event){
      var newEvent = new Event({
        title: 'SantaCon',
        lat: 37.784541,  
        lng: -122.404272,
        user_id: 1
      })
      .save();
      console.log('added dummy event "SantaCon"')
    }
  });

  Event.where({title:'Free Bagels at 8pm'}).fetch().then(function (event) {
    if(!event){
      var newEvent = new Event({
          title: 'Free Bagels at 8pm',
          lat: 37.793190, 
          lng: -122.393200,
          user_id: 1
        })
        .save();
      console.log('added dummy event "Free Bagels"')
    }
  });

},100);











