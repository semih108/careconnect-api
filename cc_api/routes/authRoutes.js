const express = require('express');
const { loginUser, logoutUser } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Public routes
router.post('/login', loginUser);

// Protected routes
router.post('/logout', authenticate, logoutUser);

module.exports = router;