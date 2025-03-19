const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register device token for push notifications
router.post('/register-device', authController.verifyToken, authController.registerDeviceToken);

// Debug endpoint to check authentication status
router.get('/status', authController.verifyToken, (req, res) => {
  res.status(200).json({
    authenticated: true,
    user: {
      email: req.user.email,
      uid: req.user.uid
    },
    dbUser: req.dbUser
  });
});

module.exports = router;
