// API base URL
const API_BASE_URL = '/api';

// Default Firebase configuration (will be replaced with actual config from server)
let firebaseConfig = {};

// VAPID key for web push notifications (will be set after config is loaded)
let VAPID_KEY = '';

// Initialize Firebase asynchronously
async function initializeFirebase() {
  try {
    // Fetch Firebase configuration from server
    const response = await fetch(`${API_BASE_URL}/config/firebase`);
    const data = await response.json();
    
    // Set Firebase config
    firebaseConfig = data.firebaseConfig;
    
    // Initialize Firebase with the config
    firebase.initializeApp(firebaseConfig);
    
    // Set VAPID key for notifications
    VAPID_KEY = firebaseConfig.messagingSenderId;
    
    console.log('Firebase initialized successfully');
    
    // Initialize auth after Firebase is ready
    if (typeof auth !== 'undefined' && auth.init) {
      auth.init();
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

// Call the initialization function
document.addEventListener('DOMContentLoaded', initializeFirebase);
