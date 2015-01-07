var Event = require('./events.model.js');

setTimeout(function(){
  Event.where({id:1}).fetch().then(function (event) {
    if(!event){
      var newEvent = new Event({
          title: 'Free Bagels at 8pm',
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











