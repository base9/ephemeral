var controller = require('./auth.controller');
var router = require('express').Router();

router.post('/login', controller.login)

module.exports = router;
