var controller = require('./events.controller');
var router = require('express').Router();
var auth = require('./../../auth/auth.service');

router.get('/geocode', controller.getCoordsFromAddress);

router.get('/reversegeocode', controller.getAddressFromCoords);

router.get('/local', controller.getLocal);

//these two endpoints (kimono and eventbrite) are for dev testing purposes only.
//TODO: they should be secured or removed at some point.
router.get('/kimono', controller.fetchBatchDataFromKimonoAPI);
router.get('/eventbrite', controller.fetchBatchDataFromEventbriteAPI);

router.get('/:id', controller.getOne);

router.get('/', controller.getAll);

// POST request to /api/events will go to controller.addOne only if logged in,
// otherwise it would redirect to homepage
router.post('/', auth.isLoggedIn, controller.addOne);

module.exports = router;
