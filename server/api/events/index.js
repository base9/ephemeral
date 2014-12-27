var controller = require('./events.controller');
var router = require('express').Router();

router.get('/local', controller.getLocal);

router.get('/:id', controller.getOne);

router.get('/', controller.getAll);

router.post('/kimono/', controller.addBatchDataFromKimonoAPI);

router.post('/', controller.addOne);


module.exports = router;
