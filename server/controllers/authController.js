const { admin } = require('../config/firebase');
const User = require('../models/User');

/**
 * Verify Firebase ID token and get user info
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.verifyToken = async (req, res, next) => {
  try {
    console.log('Verifying token...');
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');
    
    const idToken = authHeader?.split('Bearer ')[1];
    
    if (!idToken) {
      console.log('No token provided in request');
      return res.status(401).json({ error: 'No token provided' });
    }
    
    console.log('Token found, verifying with Firebase...');
    console.log('Token length:', idToken.length);
    console.log('Token prefix:', idToken.substring(0, 10) + '...');
    
    try {
      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('Token verified successfully');
      console.log('User email:', decodedToken.email);
      console.log('User ID:', decodedToken.uid);
      req.user = decodedToken;
      
      // Check if user exists in our database
      console.log('Checking if user exists in database...');
      const user = await User.findByEmail(decodedToken.email);
      
      if (!user) {
        console.log('User not found in database, creating new user...');
        // Create new user if they don't exist
        const newUser = await User.create({
          email: decodedToken.email,
          notification_time: '18:00:00', // Default to 6:00 PM
          timezone: 'America/Los_Angeles', // Default to Pacific Time
          // Additional fields can be added here
        });
        console.log('New user created:', newUser.id);
        req.dbUser = newUser;
      } else {
        console.log('User found in database:', user.id);
        req.dbUser = user;
      }
      
      next();
    } catch (verifyError) {
      console.error('Firebase token verification failed:', verifyError);
      console.error('Error details:', JSON.stringify(verifyError));
      res.status(401).json({ error: 'Invalid token', details: verifyError.message });
    }
  } catch (error) {
    console.error('Unexpected error in token verification:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};

/**
 * Register a device token for push notifications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.registerDeviceToken = async (req, res) => {
  try {
    const { deviceToken } = req.body;
    
    if (!deviceToken) {
      return res.status(400).json({ error: 'Device token is required' });
    }
    
    // Update user's device token
    const updatedUser = await User.updateDeviceToken(req.dbUser.id, deviceToken);
    
    res.status(200).json({ message: 'Device token registered successfully', user: updatedUser });
  } catch (error) {
    console.error('Error registering device token:', error);
    res.status(500).json({ error: 'Failed to register device token' });
  }
};
