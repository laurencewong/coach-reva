const supabase = require('../config/supabase');

class PromptHistory {
  /**
   * Create a new prompt history entry
   * @param {Object} historyData - Prompt history data
   * @returns {Promise} - The created prompt history entry
   */
  static async create(historyData) {
    const { data, error } = await supabase
      .from('PromptHistory')
      .insert([{
        ...historyData,
        sent_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Record a user's response to a prompt
   * @param {string} historyId - The prompt history ID
   * @param {string} userResponse - The user's response
   * @returns {Promise} - The updated prompt history entry
   */
  static async recordResponse(historyId, userResponse) {
    const { data, error } = await supabase
      .from('PromptHistory')
      .update({
        user_response: userResponse,
        responded_at: new Date().toISOString()
      })
      .eq('id', historyId)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * Get a user's prompt history
   * @param {string} userId - The user's ID
   * @param {number} [limit=10] - Number of records to return
   * @returns {Promise} - Array of prompt history entries
   */
  static async getByUserId(userId, limit = 10) {
    const { data, error } = await supabase
      .from('PromptHistory')
      .select(`
        *,
        Prompts:prompt_id (
          id,
          category,
          content
        )
      `)
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  /**
   * Get a user's most recent prompt history
   * @param {string} userId - The user's ID
   * @returns {Promise} - The most recent prompt history entry or null
   */
  static async getMostRecent(userId) {
    const { data, error } = await supabase
      .from('PromptHistory')
      .select(`
        *,
        Prompts:prompt_id (
          id,
          category,
          content
        )
      `)
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Get users who haven't responded to their most recent prompt
   * @param {number} [hoursAgo=24] - Hours to look back
   * @returns {Promise} - Array of users and their prompt history
   */
  static async getUsersWithPendingResponses(hoursAgo = 24) {
    const date = new Date();
    date.setHours(date.getHours() - hoursAgo);
    
    const { data, error } = await supabase
      .from('PromptHistory')
      .select(`
        *,
        Users:user_id (
          id,
          email,
          device_token
        ),
        Prompts:prompt_id (
          id,
          category,
          content
        )
      `)
      .is('responded_at', null)
      .gte('sent_at', date.toISOString());
    
    if (error) throw error;
    return data;
  }
}

module.exports = PromptHistory;
