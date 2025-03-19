const Prompt = require('../models/Prompt');
const PromptHistory = require('../models/PromptHistory');
const User = require('../models/User');
const { admin } = require('../config/firebase');

/**
 * Get a daily prompt for the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDailyPrompt = async (req, res) => {
  try {
    // Get a prompt that hasn't been sent to the user recently
    let prompt;
    try {
      prompt = await Prompt.getNotRecentlySent(req.dbUser.id);
    } catch (promptError) {
      console.error('Error getting prompt from database:', promptError);
      // Provide a fallback prompt if database query fails
      prompt = {
        id: 'fallback-prompt-id',
        content: "What's one small thing your partner did recently that made you feel appreciated?",
        category: "appreciation",
        difficulty: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    if (!prompt) {
      // Provide a fallback prompt if none is available
      prompt = {
        id: 'fallback-prompt-id',
        content: "Share something your partner does that always makes you smile.",
        category: "appreciation",
        difficulty: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    // Create a prompt history entry
    let promptHistory;
    try {
      promptHistory = await PromptHistory.create({
        user_id: req.dbUser.id,
        prompt_id: prompt.id
      });
    } catch (historyError) {
      console.error('Error creating prompt history:', historyError);
      // Provide a fallback history if database insert fails
      promptHistory = {
        id: 'fallback-history-id',
        user_id: req.dbUser.id,
        prompt_id: prompt.id,
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    // Update user's last prompt ID (don't block response on this)
    try {
      await User.updateLastPromptId(req.dbUser.id, prompt.id);
    } catch (updateError) {
      console.error('Error updating last prompt ID:', updateError);
      // Continue anyway
    }
    
    res.status(200).json({ 
      prompt,
      promptHistory
    });
  } catch (error) {
    console.error('Error getting daily prompt:', error);
    res.status(500).json({ error: 'Failed to get daily prompt' });
  }
};

/**
 * Submit a response to a prompt
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.submitResponse = async (req, res) => {
  try {
    const { promptHistoryId, response } = req.body;
    
    if (!promptHistoryId || !response) {
      return res.status(400).json({ error: 'Prompt history ID and response are required' });
    }
    
    // Record the user's response
    const updatedHistory = await PromptHistory.recordResponse(promptHistoryId, response);
    
    res.status(200).json({ 
      message: 'Response recorded successfully',
      promptHistory: updatedHistory
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
};

/**
 * Get a user's prompt history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPromptHistory = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    
    // Get the user's prompt history
    const history = await PromptHistory.getByUserId(req.dbUser.id, limit);
    
    res.status(200).json({ history });
  } catch (error) {
    console.error('Error getting prompt history:', error);
    res.status(500).json({ error: 'Failed to get prompt history' });
  }
};

/**
 * Send push notifications to users who haven't responded
 * This would typically be called by a scheduled function
 */
exports.sendReminderNotifications = async (req, res) => {
  try {
    // Get users who haven't responded to their most recent prompt
    const pendingUsers = await PromptHistory.getUsersWithPendingResponses();
    
    if (pendingUsers.length === 0) {
      return res.status(200).json({ message: 'No pending responses to remind about' });
    }
    
    const messaging = admin.messaging();
    const notifications = [];
    
    // Send a notification to each user
    for (const user of pendingUsers) {
      if (user.Users.device_token) {
        const message = {
          token: user.Users.device_token,
          notification: {
            title: 'Coach Reva Reminder',
            body: 'Don\'t forget to respond to your daily relationship prompt!'
          },
          data: {
            promptHistoryId: user.id,
            promptId: user.prompt_id
          }
        };
        
        try {
          const result = await messaging.send(message);
          notifications.push({ userId: user.user_id, result });
        } catch (error) {
          console.error(`Error sending notification to user ${user.user_id}:`, error);
          notifications.push({ userId: user.user_id, error: error.message });
        }
      }
    }
    
    res.status(200).json({ 
      message: `Sent ${notifications.length} reminder notifications`,
      notifications
    });
  } catch (error) {
    console.error('Error sending reminder notifications:', error);
    res.status(500).json({ error: 'Failed to send reminder notifications' });
  }
};
