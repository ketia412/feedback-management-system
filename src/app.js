const express = require('express');
const { trackRequest, trackFeedback, getMetrics } = require('./metrics');

const app = express();

// Middleware
app.use(express.json());

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
  
  // Validation
  if (!name || !email || !message || !rating) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }
  
  const feedback = {
    id: nextId++,
    name,
    email,
    message,
    rating: parseInt(rating),
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