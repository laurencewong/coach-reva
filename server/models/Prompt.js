const supabase = require('../config/supabase');

class Prompt {
  /**
   * Get all prompts
   * @returns {Promise} - Array of all prompts
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('Prompts')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  /**
   * Get prompts by category
   * @param {string} category - The category to filter by
   * @returns {Promise} - Array of prompts in the category
   */
  static async getByCategory(category) {
    const { data, error } = await supabase
      .from('Prompts')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    return data;
  }

  /**
   * Get a prompt by ID
   * @param {string} id - The prompt ID
   * @returns {Promise} - The prompt or null
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('Prompts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Get a random prompt, optionally from a specific category
   * @param {string} [category] - Optional category to filter by
   * @returns {Promise} - A random prompt
   */
  static async getRandom(category = null) {
    let query = supabase
      .from('Prompts')
      .select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    if (data.length === 0) return null;
    
    // Get a random prompt from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }

  /**
   * Get a prompt that hasn't been sent to the user recently
   * @param {string} userId - The user's ID
   * @param {number} [daysAgo=7] - Number of days to look back
   * @returns {Promise} - A prompt not recently sent to the user
   */
  static async getNotRecentlySent(userId, daysAgo = 7) {
    // Get prompts sent to the user in the last X days
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const { data: recentPrompts, error: recentError } = await supabase
      .from('PromptHistory')
      .select('prompt_id')
      .eq('user_id', userId)
      .gte('sent_at', date.toISOString());
    
    if (recentError) throw recentError;
    
    // Get all prompts
    const { data: allPrompts, error: allError } = await supabase
      .from('Prompts')
      .select('*');
    
    if (allError) throw allError;
    
    // Filter out recently sent prompts
    const recentPromptIds = recentPrompts.map(p => p.prompt_id);
    const availablePrompts = allPrompts.filter(p => !recentPromptIds.includes(p.id));
    
    if (availablePrompts.length === 0) {
      // If all prompts have been sent recently, just return a random one
      return this.getRandom();
    }
    
    // Get a random prompt from the available ones
    const randomIndex = Math.floor(Math.random() * availablePrompts.length);
    return availablePrompts[randomIndex];
  }
}

module.exports = Prompt;
