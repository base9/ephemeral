var models = require('../../db/models.js');
var User = require('./user.model.js');

setTimeout(function(){

  User.where({name:'Steve Erwin'}).fetch().then(function (user) {
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


},100);











