const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController');

// Order matters: more specific routes first
router.get('/:id/stats', controller.getEventStats);
router.get('/', controller.listUpcomingEvents);
router.get('/:id', controller.getEventDetails);

router.post('/', controller.createEvent);
router.post('/:id/register', controller.registerUser);
router.delete('/:id/cancel/:userId', controller.cancelRegistration);

module.exports = router;
