var Event = require('./events.model.js');

setTimeout(function(){

  Event.where({title:'SantaCon'}).fetch().then(function (evnt) {
    if(!evnt){
      var newEvent = new Event({
        title: 'SantaCon',
        lat: 37.784541,  
        lng: -122.404272,
        user_id: 1
      })
      .save();
      console.log('added dummy event "SantaCon"');
    }
  });

  Event.where({title:'Free Bagels at 8pm'}).fetch().then(function (evnt) {
    if(!evnt){
      var newEvent = new Event({
          title: 'Free Bagels at 8pm',
          lat: 37.793190, 
          lng: -122.393200,
          user_id: 1
        })
        .save();
      console.log('added dummy event "Free Bagels at 8pm"');
    }
  });

  Event.where({title:'Snarf at 8pm'}).fetch().then(function (evnt) {
    if(!evnt){
      var newEvent = new Event({
          title: 'Snarf at 8pm',
          startTime: '1420516800000',
          endTime: null,
          lat: 37.7931290,
          lng: -122.394200,
          user_id: 1
        })
        .save();
      console.log('added dummy event "Snarfy at 8pm"');
    }
  });

},100);











