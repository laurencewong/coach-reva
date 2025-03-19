// API module for Coach Reva
const api = {
  // Get auth header
  getAuthHeader() {
    const token = sessionStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  },
  
  // Make API request
  async request(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: this.getAuthHeader()
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  // Get daily prompt
  getDailyPrompt() {
    return this.request('/prompts/daily');
  },
  
  // Submit response to prompt
  submitResponse(promptHistoryId, response) {
    return this.request('/prompts/respond', 'POST', {
      promptHistoryId,
      response
    });
  },
  
  // Get prompt history
  getPromptHistory(limit = 10) {
    return this.request(`/prompts/history?limit=${limit}`);
  },
  
  // Get user profile
  getUserProfile() {
    return this.request('/users/profile');
  },
  
  // Update user preferences
  updatePreferences(preferences) {
    return this.request('/users/preferences', 'PUT', preferences);
  },
  
  // Register device token for notifications
  registerDeviceToken(deviceToken) {
    return this.request('/auth/register-device', 'POST', {
      deviceToken
    });
  },
  
  // Opt out of notifications
  optOutNotifications() {
    return this.request('/users/opt-out', 'POST');
  }
};
