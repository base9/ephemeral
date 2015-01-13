var Comment = require('./comments.model.js');
var Event = require('../events/events.model.js');

setTimeout(function(){
  
  Event.where({title:'Free Bagels at 8pm'}).fetch().then(function (event) {
  });

  // Event.where({title:'SantaCon'}).fetch().then(function (event) {
  //   if(event){
  //       var newComment = new Comment({
  //         user_id: 1,
  //         event_id: event.id,
  //         comment: 'he was very friendly'
  //       })
  //       .save();
  //       console.log('added dummy comment for SantaCon');
  //   }
  // });

},100);

