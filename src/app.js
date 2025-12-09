const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// In-memory storage
let feedbacks = [];
let nextId = 1;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all feedback
app.get('/api/feedback', (req, res) => {
  res.status(200).json({
    success: true,
    count: feedbacks.length,
    data: feedbacks
  });
});

// Get feedback by ID
app.get('/api/feedback/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const feedback = feedbacks.find(f => f.id === id);
  
  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: feedback
  });
});

// Submit new feedback
app.post('/api/feedback', (req, res) => {
  const { name, email, message, rating } = req.body;
  
  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and message'
    });
  }
  
  if (rating && (rating < 1 || rating > 5)) {
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
    rating: rating || null,
    createdAt: new Date().toISOString()
  };
  
  feedbacks.push(feedback);
  
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