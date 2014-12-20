var controller = require('./photo.controller');
var router = require('express').Router();

router.get('/:id', controller.getOne);

router.get('/', controller.getAll);


module.exports = router;
