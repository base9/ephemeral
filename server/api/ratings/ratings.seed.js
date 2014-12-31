var Rating = require('./ratings.model.js');
var Event = require('../events/events.model.js');

setTimeout(function(){
  
  Event.where({title:'Free Bagels at 8pm'}).fetch().then(function (evnt) {
    if(evnt){
      Rating.where({comment:'The bagels were like, soooo stale'}).fetch().then(function (rating) {
        if(!rating){
          var newRating = new Rating({
            comment: 'The bagels were like, soooo stale',
            user_id: 1,
            event_id: evnt.id,
            stars: 3
          })
          .save();
          console.log('added dummy rating for bagel event');
        }
      });
    }
  });

  Event.where({title:'SantaCon'}).fetch().then(function (evnt) {
    if(evnt){
      Rating.where({comment:'Santa was very friendly'}).fetch().then(function (rating) {
        if(!rating){
          var newRating1 = new Rating({
            comment: 'Santa was very friendly',
            user_id: 1,
            event_id: evnt.id,
            stars: 5
          })
          .save();
          console.log('added dummy rating 1 for SantaCon event');
          var newRating2 = new Rating({
            comment: 'i was told there would be presents',
            user_id: 1,
            event_id: evnt.id,
            stars: 1
          })
          .save();
          console.log('added dummy rating 2 for SantaCon event');
        }
      })
    }
  });

},100);

