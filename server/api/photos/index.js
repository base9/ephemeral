var controller = require('./photos.controller');
var router = require('express').Router();

router.post('/addOne', controller.addOne);

router.get('/upload', controller.getUploadParams);

router.post('/delete', controller.deleteOne);

module.exports = router;
