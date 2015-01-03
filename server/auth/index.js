// This file is not currently in use.
// See server/router.js
var controller = require('./auth.controller');
var router = require('express').Router();

// router.post('/login', passport.authenticate('local-login', {
//   successRedirect : '/', // redirect to the secure profile section
//   failureRedirect : '/login', // redirect back to the login page if there is an error
//   failureFlash : true // allow flash messages
// }));

module.exports = router;
