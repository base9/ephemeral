var models = require('../../db/models.js');

setTimeout(function(){
  models.Pin.where({title:'SantaCon'}).fetch().then(function (pin) {
    if(!pin){
      var newPin = new models.Pin({
        title: 'SantaCon',
        latitude: 37.784541,  
        longitude: -122.404272
      })
      .save();
      console.log('added dummy pin "SantaCon"')
    }
  });
},200);

setTimeout(function(){
  models.Pin.where({title:'Free Bagels at 8pm'}).fetch().then(function (pin) {
    if(!pin){
      var newPin = new models.Pin({
          title: 'Free Bagels at 8pm',
          latitude: 37.793190, 
          longitude: -122.393200
        })
        .save();
      console.log('added dummy pin "Free Bagels"')
    }
  });
},200);




  // models.User({
  //   name: 'Steve Erwin',
  //   email: 'steve@outbackadventures.com',
  //   bio: 'global explorer and animal lover',
  // })
  // .save();





