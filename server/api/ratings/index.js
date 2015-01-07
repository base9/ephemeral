var controller = require('./ratings.controller');
var router = require('express').Router();

router.post('/', controller.addOne);



module.exports = router;
