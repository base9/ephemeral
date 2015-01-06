var controller = require('./photos.controller');
var router = require('express').Router();


router.get('/s3GetTest', controller.s3GetTest);

router.get('/s3SignedPostTest', controller.s3SignedPostTest);

router.post('/s3PostTest', controller.s3PostTest);

router.post('/addOne', controller.addOne);

router.get('/:id', controller.getOne);

router.get('/', controller.getAll);

module.exports = router;
