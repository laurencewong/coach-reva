const express = require('express');
const router = express.Router();
const { firebaseConfig } = require('../config/firebase');

/**
 * Get Firebase configuration for the client
 * This endpoint provides the necessary Firebase configuration to the frontend
 */
router.get('/firebase', (req, res) => {
  res.json({ firebaseConfig });
});

module.exports = router;
