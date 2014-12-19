var models = require('../../db/models.js');

var newPin = new models.Pin({
    title: 'SantaCon',
    latitude: 37.793190, 
    longitude: -122.393200
  })
  .save();

var newPin = new models.Pin({
    title: 'Free Bagels at 8pm',
    latitude: 37.784541,  
    longitude: -122.404272
  })
  .save();


  // models.User({
  //   name: 'Steve Erwin',
  //   email: 'steve@outbackadventures.com',
  //   bio: 'global explorer and animal lover',
  // })
  // .save();





