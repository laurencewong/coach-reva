// Notifications module for Coach Reva
const notifications = {
  // Firebase messaging instance
  messaging: null,
  
  // Initialize notifications
  async init() {
    // Check if Firebase is initialized
    if (!firebase.apps.length) {
      console.log('Firebase not initialized yet, notifications initialization will be called later');
      return;
    }
    
    if (!firebase.messaging || !firebase.messaging.isSupported()) {
      console.log('Firebase messaging is not supported in this browser');
      return;
    }
    
    this.messaging = firebase.messaging();
    
    // Request permission
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted');
        this.getToken();
      } else {
        console.log('Unable to get permission to notify');
        // Update UI to show notifications are disabled
        if (document.getElementById('notification-toggle')) {
          document.getElementById('notification-toggle').checked = false;
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
    
    // Set up notification received handler
    this.messaging.onMessage((payload) => {
      console.log('Message received:', payload);
      this.showNotification(payload.notification);
    });
  },
  
  // Get FCM token
  async getToken() {
    try {
      const currentToken = await this.messaging.getToken({ vapidKey: VAPID_KEY });
      
      if (currentToken) {
        console.log('FCM token:', currentToken);
        // Send token to server
        await api.registerDeviceToken(currentToken);
        return currentToken;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },
  
  // Delete FCM token
  async deleteToken() {
    try {
      await this.messaging.deleteToken();
      console.log('Token deleted');
      // Notify server
      await api.optOutNotifications();
      return true;
    } catch (error) {
      console.error('Error deleting token:', error);
      return false;
    }
  },
  
  // Show notification
  showNotification({ title, body }) {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }
    
    if (Notification.permission === 'granted') {
      const options = {
        body,
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-96x96.png'
      };
      
      const notification = new Notification(title, options);
      
      notification.onclick = function() {
        window.focus();
        notification.close();
      };
    }
  }
};
