var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../api/users/users.model');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		// find user by id
    // pass it to done
    User.where({id: id})
    .fetch()
    .then(function (user) {
      done(null, user);
    });

  //   User.findById(id, function(err, user) {
		// 	done(err, user);
		// });
	});

	//LOCAL SIGNUP

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'pwd',
		passReqToCallback: true // allows us to pass back the entire request to the callback
	},    
  function (req, email, password, done) {
    console.log('passporting', email, password);
    User.where({email: email})
      .fetch()
      .then(function (user) {
        // if username is taken
        console.log('user', user);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }

        // if there is no user with that email
        // create the user

        var newUser = new User();

        newUser.set({
          email: email,
          pwd: newUser.generateHash(password)
        });

        newUser.save()
        .then(function () {
          return done(null, newUser);
        }); 

      });
	}));

	//LOCAL LOGIN

	passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd',
    passReqToCallback: true
	},
	function(req, email, password, done) {
    User.where({email: email})
      .fetch()
      .then(function (user) {
        if (!user || !user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Invalid username or password'));
        }

        return done(null, user);
      });
	 
   //  User.findOne({ 'email':  email }, function(err, user) {
	  //   if (err) { return done(err) };

	  //   if (!user || !user.validPassword(password)) {
	  //   	return done(null, false, req.flash('loginMessage', 'Invalid username or password'));
	  //   }

	  //   return done(null, user);
	  // });

	}));
};

