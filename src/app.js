const express = require('express');
const path = require('path');
const { trackRequest, trackFeedback, getMetrics } = require('./metrics');

const app = express();

// Middleware
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Track all requests
app.use((req, res, next) => {
  trackRequest();
  next();
});

// In-memory storage
let feedbacks = [];
let nextId = 1;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(getMetrics());
});

// Get all feedback
app.get('/api/feedback', (req, res) => {
  res.json({
    success: true,
    count: feedbacks.length,
    data: feedbacks
  });
});

// Get feedback by ID
app.get('/api/feedback/:id', (req, res) => {
  const feedback = feedbacks.find(f => f.id === parseInt(req.params.id));
  
  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }
  
  res.json({
    success: true,
    data: feedback
  });
});

// Submit new feedback
app.post('/api/feedback', (req, res) => {
  const { name, email, message, rating } = req.body;
  
  // Validation - name, email, and message are required; rating is optional
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Validate rating if provided
  if (rating !== undefined && rating !== null) {
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
  }
  
  const feedback = {
    id: nextId++,
    name,
    email,
    message,
    rating: rating !== undefined && rating !== null ? parseInt(rating) : null,
    createdAt: new Date().toISOString()
  };
  
  feedbacks.push(feedback);
  trackFeedback(); // Track feedback submission
  
  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    data: feedback
  });
});

// Test-only route to exercise error handler
if (process.env.NODE_ENV === 'test') {
  app.get('/error-trigger', () => {
    throw new Error('Boom');
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;