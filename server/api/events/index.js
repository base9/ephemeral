var controller = require('./events.controller');
var router = require('express').Router();
var auth = require('./../../auth/auth.service');

router.get('/local', controller.getLocal);

router.post('/kimono', controller.addBatchDataFromKimonoAPI);

router.get('/:id', controller.getOne);

router.get('/', controller.getAll);

// POST -> /api/events 
router.post('/', auth.isLoggedIn, controller.addOne);

module.exports = router;
