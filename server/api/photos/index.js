var controller = require('./photos.controller');
var router = require('express').Router();

router.post('/addOne', controller.addOne);

module.exports = router;
