var User = require('./users.model.js');

setTimeout(function(){

  User.where({id:1}).fetch().then(function (user) {
    if(!user){
      var newUser = new User({
        name: 'Steve Erwin',
        email: 'steve@outbackadventures.com',
        bio: 'global explorer and animal lover'
      })
      .save();
      console.log('added dummy user "Steve Erwin"');
    }
  });


},100);











