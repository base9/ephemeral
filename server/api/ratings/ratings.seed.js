var Rating = require('./ratings.model.js');
var Event = require('../events/events.model.js');

setTimeout(function(){
  
  Event.where({id:1}).fetch().then(function (event) {
    if(event){
        var newRating = new Rating({
          user_id: 1,
          event_id: event.id,
        })
        .save();
        console.log('added dummy rating for bagel event');
    }
  });


},100);

