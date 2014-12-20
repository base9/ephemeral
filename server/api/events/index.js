var controller = require('./events.controller');
var router = require('express').Router();

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

module.exports = router;
