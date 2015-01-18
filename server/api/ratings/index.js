var controller = require('./ratings.controller');
var router = require('express').Router();

router.post('/', controller.updateRating);



module.exports = router;
