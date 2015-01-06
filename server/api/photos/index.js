var controller = require('./photos.controller');
var router = require('express').Router();

router.post('/addOne', controller.addOne);

router.post('/delete', controller.deleteOne);

module.exports = router;
