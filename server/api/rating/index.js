var controller = require('./rating.controller');
var router = require('express').Router();

router.get('/', controller.index);
// router.get('/:id', controller.show);

// router.post('/', controller.create);

module.exports = router;
