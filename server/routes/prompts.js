const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const authController = require('../controllers/authController');

// Apply auth middleware to all routes
router.use(authController.verifyToken);

// Get daily prompt
router.get('/daily', promptController.getDailyPrompt);

// Submit response to a prompt
router.post('/respond', promptController.submitResponse);

// Get prompt history
router.get('/history', promptController.getPromptHistory);

// Send reminder notifications (would typically be triggered by a scheduled function)
router.post('/send-reminders', promptController.sendReminderNotifications);

module.exports = router;
