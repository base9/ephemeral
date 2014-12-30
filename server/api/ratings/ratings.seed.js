var Rating = require('./ratings.model.js');

setTimeout(function(){
  
  Rating.where({comment:'The bagels were like, soooo stale'}).fetch().then(function (rating) {
    if(!rating){
      var newRating = new Rating({
        comment: 'The bagels were like, soooo stale',
        user_id: 1,
        event_id: 2,
        stars: 3
      })
      .save();
      console.log('added dummy rating for bagel event')
    }
  });

  Rating.where({comment:'Santa was very friendly'}).fetch().then(function (rating) {
    if(!rating){
      var newRating = new Rating({
        comment: 'Santa was very friendly',
        user_id: 1,
        event_id: 1,
        stars: 5,
      })
      .save();
      console.log('added dummy rating 1 of 2 for SantaCon')
    }
  });  

  Rating.where({comment:'i was told there would be presents'}).fetch().then(function (rating) {
    if(!rating){
      var newRating = new Rating({
        comment: 'i was told there would be presents',
        user_id: 1,
        event_id: 1,
        stars: 2
      })
      .save();
      console.log('added dummy rating 2 of 2 for SantaCon')
    }
  });

},100);

