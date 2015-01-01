var controller = require('./events.controller');
var router = require('express').Router();

router.get('/local', controller.getLocal);

router.get('/kimono', controller.fetchBatchDataFromKimonoAPI);

router.get('/eventbrite', controller.fetchBatchDataFromEventbriteAPI);

router.get('/:id', controller.getOne);

router.get('/', controller.getAll);

router.post('/', controller.addOne);

module.exports = router;
