const express = require('express');
const authenticate = require('../middleware/authenticate');
const {
    getNotifications, markNotificationAsRead
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.post('/:id/read', authenticate, markNotificationAsRead);

module.exports = router;