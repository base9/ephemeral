var controller = require('./photos.controller');
var router = require('express').Router();


router.get('/s3', controller.s3);

router.get('/:id', controller.getOne);

router.get('/', controller.getAll);

module.exports = router;
