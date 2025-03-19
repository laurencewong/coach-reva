// Auth module for Coach Reva
const auth = {
  // Current user
  currentUser: null,
  
  // Firebase auth instance
  authInstance: null,
  
  // Initialize auth
  init() {
    // Check if Firebase is initialized
    if (!firebase.apps.length) {
      console.log('Firebase not initialized yet, auth initialization will be called later');
      return;
    }
    
    // Set auth instance
    this.authInstance = firebase.auth();
    
    // Set up auth state change listener
    this.authInstance.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.getIdToken().then(token => {
          // Store token in session storage
          sessionStorage.setItem('authToken', token);
          
          // Show authenticated UI
          document.getElementById('login-screen').classList.add('hidden');
          document.getElementById('user-info').classList.remove('hidden');
          document.getElementById('bottom-nav').classList.remove('hidden');
          
          // Show check-in screen by default and hide other screens
          document.getElementById('check-in-screen').classList.remove('hidden');
          document.getElementById('history-screen').classList.add('hidden');
          document.getElementById('settings-screen').classList.add('hidden');
          
          // Make sure the check-in nav item is active
          document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
          document.getElementById('nav-check-in').classList.add('active');
          
          // Initialize notifications
          notifications.init();
          
          // Load user data and daily prompt
          app.loadUserData();
        });
      } else {
        this.currentUser = null;
        sessionStorage.removeItem('authToken');
        
        // Show login UI
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('user-info').classList.add('hidden');
        document.getElementById('bottom-nav').classList.add('hidden');
        document.getElementById('check-in-screen').classList.add('hidden');
        document.getElementById('history-screen').classList.add('hidden');
        document.getElementById('settings-screen').classList.add('hidden');
      }
    });
    
    // Set up login button
    document.getElementById('login-btn').addEventListener('click', () => {
      this.signInWithGoogle();
    });
    
    // Set up logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.signOut();
    });
  },
  
  // Sign in with Google
  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.authInstance.signInWithPopup(provider)
      .catch(error => {
        console.error('Error signing in:', error);
        alert('Failed to sign in. Please try again.');
      });
  },
  
  // Sign out
  signOut() {
    this.authInstance.signOut()
      .catch(error => {
        console.error('Error signing out:', error);
      });
  },
  
  // Get ID token
  async getIdToken() {
    if (!this.currentUser) return null;
    try {
      return await this.currentUser.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
};
