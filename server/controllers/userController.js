const User = require('../models/User');
const PromptHistory = require('../models/PromptHistory');
const { supabase } = require('../config/supabase');

/**
 * Get user profile information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProfile = async (req, res) => {
  try {
    // Get the user's most recent prompt history
    const recentPrompt = await PromptHistory.getMostRecent(req.dbUser.id);
    
    // Return user info with recent prompt
    res.status(200).json({
      user: req.dbUser,
      recentPrompt
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

/**
 * Update user preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updatePreferences = async (req, res) => {
  try {
    const { notificationTime, preferredCategories } = req.body;
    
    // Update user preferences in database
    // Note: We would need to add these fields to the Users table
    const { data, error } = await supabase
      .from('Users')
      .update({
        notification_time: notificationTime,
        preferred_categories: preferredCategories
      })
      .eq('id', req.dbUser.id)
      .select();
    
    if (error) throw error;
    
    res.status(200).json({ 
      message: 'Preferences updated successfully',
      user: data[0]
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

/**
 * Opt out of notifications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.optOutNotifications = async (req, res) => {
  try {
    // Remove the device token
    const updatedUser = await User.updateDeviceToken(req.dbUser.id, null);
    
    res.status(200).json({ 
      message: 'Successfully opted out of notifications',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error opting out of notifications:', error);
    res.status(500).json({ error: 'Failed to opt out of notifications' });
  }
};
