// Main app module for Coach Reva
const app = {
  // Current prompt data
  currentPrompt: null,
  currentPromptHistory: null,
  
  // Initialize app
  init() {
    // This method is kept for compatibility but is now called by auth.js
    // after Firebase and auth are initialized
    this.loadUserData();
  },
  
  // Set up navigation
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const screens = [
      document.getElementById('check-in-screen'),
      document.getElementById('history-screen'),
      document.getElementById('settings-screen')
    ];
    
    navItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Update active nav item
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Show selected screen
        screens.forEach(s => s.classList.add('hidden'));
        screens[index].classList.remove('hidden');
        
        // Load data for the screen if needed
        if (index === 0) {
          this.loadDailyPrompt();
        } else if (index === 1) {
          this.loadPromptHistory();
        }
      });
    });
  },
  
  // Load user data
  async loadUserData() {
    try {
      // First, prioritize loading the daily prompt to show it immediately
      await this.loadDailyPrompt();
      
      // Then load user profile data
      const { user, recentPrompt } = await api.getUserProfile();
      console.log('User profile loaded:', user);
      
      // Set notification time if available
      if (user.notification_time) {
        document.getElementById('notification-time').value = user.notification_time;
      }
      
      // Set notification toggle based on device token
      document.getElementById('notification-toggle').checked = !!user.device_token;
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },
  
  // Load daily prompt
  async loadDailyPrompt() {
    try {
      // Show loading state
      document.getElementById('loading-indicator').classList.remove('hidden');
      document.getElementById('prompt-text').textContent = '';
      document.getElementById('prompt-container').classList.remove('hidden');
      document.getElementById('response-success').classList.add('hidden');
      document.getElementById('response-input').classList.add('hidden');
      document.getElementById('submit-btn').classList.add('hidden');
      
      // Check if we already have a prompt for today
      const { history } = await api.getPromptHistory(1);
      
      if (history && history.length > 0) {
        const latestPrompt = history[0];
        const promptDate = new Date(latestPrompt.sent_at).toDateString();
        const today = new Date().toDateString();
        
        if (promptDate === today) {
          // We already have a prompt for today
          if (latestPrompt.responded_at) {
            // User has already responded
            document.getElementById('loading-indicator').classList.add('hidden');
            document.getElementById('prompt-container').classList.add('hidden');
            document.getElementById('response-success').classList.remove('hidden');
            return;
          } else {
            // User hasn't responded yet, show the prompt
            this.currentPrompt = latestPrompt.Prompts;
            this.currentPromptHistory = latestPrompt;
            document.getElementById('loading-indicator').classList.add('hidden');
            document.getElementById('prompt-text').textContent = this.currentPrompt.content;
            document.getElementById('response-input').classList.remove('hidden');
            document.getElementById('submit-btn').classList.remove('hidden');
            document.getElementById('response-input').value = '';
            return;
          }
        }
      }
      
      // Get a new prompt
      const { prompt, promptHistory } = await api.getDailyPrompt();
      this.currentPrompt = prompt;
      this.currentPromptHistory = promptHistory;
      
      // Display the prompt
      document.getElementById('loading-indicator').classList.add('hidden');
      document.getElementById('prompt-container').classList.remove('hidden');
      document.getElementById('response-success').classList.add('hidden');
      document.getElementById('prompt-text').textContent = prompt.content;
      document.getElementById('response-input').classList.remove('hidden');
      document.getElementById('submit-btn').classList.remove('hidden');
      document.getElementById('response-input').value = '';
    } catch (error) {
      console.error('Error loading daily prompt:', error);
      document.getElementById('loading-indicator').classList.add('hidden');
      document.getElementById('prompt-text').textContent = 'Unable to load your daily check-in. Please try refreshing the page.';
      document.getElementById('response-input').classList.add('hidden');
      document.getElementById('submit-btn').classList.add('hidden');
    }
  },
  
  // Submit response to prompt
  async submitResponse() {
    const responseInput = document.getElementById('response-input');
    const response = responseInput.value.trim();
    
    if (!response) {
      alert('Please enter a response before submitting.');
      return;
    }
    
    if (!this.currentPromptHistory) {
      alert('No active prompt found. Please refresh the page.');
      return;
    }
    
    try {
      await api.submitResponse(this.currentPromptHistory.id, response);
      
      // Show success message
      document.getElementById('prompt-container').classList.add('hidden');
      document.getElementById('response-success').classList.remove('hidden');
      
      // Clear input
      responseInput.value = '';
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    }
  },
  
  // Load prompt history
  async loadPromptHistory() {
    try {
      const { history } = await api.getPromptHistory(10);
      const historyList = document.getElementById('history-list');
      
      // Clear existing history
      historyList.innerHTML = '';
      
      if (history.length === 0) {
        historyList.innerHTML = '<p>No check-in history yet. Start by completing today\'s check-in!</p>';
        return;
      }
      
      // Add history items
      history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(item.sent_at).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        
        historyItem.innerHTML = `
          <div class="history-date">${date}</div>
          <div class="history-prompt">${item.Prompts.content}</div>
          ${item.user_response ? `<div class="history-response">${item.user_response}</div>` : 
            '<div class="history-response">No response recorded</div>'}
        `;
        
        historyList.appendChild(historyItem);
      });
    } catch (error) {
      console.error('Error loading prompt history:', error);
    }
  },
  
  // Save user settings
  async saveSettings() {
    const notificationTime = document.getElementById('notification-time').value;
    const notificationsEnabled = document.getElementById('notification-toggle').checked;
    
    try {
      // Update preferences
      await api.updatePreferences({
        notificationTime
      });
      
      // Handle notification toggle
      if (notificationsEnabled) {
        await notifications.getToken();
      } else {
        await notifications.deleteToken();
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI components first
  app.setupNavigation();
  
  // Set up check-in form
  document.getElementById('submit-btn').addEventListener('click', () => {
    app.submitResponse();
  });
  
  // Set up settings form
  document.getElementById('save-settings-btn').addEventListener('click', () => {
    app.saveSettings();
  });
  
  // Set up notification toggle
  document.getElementById('notification-toggle').addEventListener('change', (e) => {
    if (e.target.checked) {
      notifications.init();
    } else {
      notifications.deleteToken();
    }
  });
  
  // Auth initialization will be triggered by config.js after Firebase is loaded
});
