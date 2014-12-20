var controller = require('./event.controller');
var router = require('express').Router();

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

module.exports = router;
