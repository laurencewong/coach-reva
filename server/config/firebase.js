const admin = require('firebase-admin');

// Firebase Admin SDK initialization (for server-side operations)
// Initialize Firebase Admin with service account credentials from .env
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // The private key needs to have newlines properly handled
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin initialized with project ID:', process.env.FIREBASE_PROJECT_ID);

// Firebase client configuration (for browser)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

module.exports = {
  admin,
  firebaseConfig
};
