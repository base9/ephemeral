var controller = require('./events.controller');
var router = require('express').Router();
var auth = require('./../../auth/auth.service');

router.get('/local', controller.getLocal);

router.get('/kimono', controller.fetchBatchDataFromKimonoAPI);

router.get('/eventbrite', controller.fetchBatchDataFromEventbriteAPI);

router.get('/:id', controller.getOne);

router.get('/', controller.getAll);

// POST -> /api/events 
router.post('/', auth.isLoggedIn, controller.addOne);

module.exports = router;
