const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Apply auth middleware to all routes
router.use(authController.verifyToken);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user preferences
router.put('/preferences', userController.updatePreferences);

// Opt out of notifications
router.post('/opt-out', userController.optOutNotifications);

module.exports = router;
