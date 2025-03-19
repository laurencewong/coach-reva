const supabase = require('../config/supabase');

class User {
  /**
   * Create a new user in the database
   * @param {Object} userData - User data including email and device_token
   * @returns {Promise} - The created user
   */
  static async create(userData) {
    // Ensure required fields have default values
    if (!userData.notification_time) {
      userData.notification_time = '18:00:00'; // Default to 6:00 PM
    }
    
    if (!userData.timezone) {
      userData.timezone = 'America/Los_Angeles'; // Default to Pacific Time
    }
    
    const { data, error } = await supabase
      .from('Users')
      .insert([userData])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Find a user by email
   * @param {string} email - The user's email
   * @returns {Promise} - The found user or null
   */
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Update a user's device token
   * @param {string} userId - The user's ID
   * @param {string} deviceToken - The FCM device token
   * @returns {Promise} - The updated user
   */
  static async updateDeviceToken(userId, deviceToken) {
    const { data, error } = await supabase
      .from('Users')
      .update({ device_token: deviceToken })
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Update a user's last prompt ID
   * @param {string} userId - The user's ID
   * @param {string} promptId - The prompt ID
   * @returns {Promise} - The updated user
   */
  static async updateLastPromptId(userId, promptId) {
    const { data, error } = await supabase
      .from('Users')
      .update({ last_prompt_id: promptId })
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Get all users with device tokens
   * @returns {Promise} - Array of users with device tokens
   */
  static async getAllWithDeviceTokens() {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .not('device_token', 'is', null);
    
    if (error) throw error;
    return data;
  }
}

module.exports = User;
