var models = require('../../db/models.js');
var Event = require('./event.model.js');

setTimeout(function(){

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











