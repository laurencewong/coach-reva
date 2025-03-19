require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./server/routes/auth');
const promptRoutes = require('./server/routes/prompts');
const userRoutes = require('./server/routes/users');
const configRoutes = require('./server/routes/config');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Configure CORS based on environment
const corsOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.APP_URL || '*'] // In production, use the APP_URL or allow all origins
  : ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://127.0.0.1:56182']; // Dev origins

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/users', userRoutes);
app.use('/api/config', configRoutes);

// Serve the main HTML file for all other routes (SPA approach)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
