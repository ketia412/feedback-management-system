const PORT = process.env.PORT || 3000;
const app = require('./app');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Feedback Management System running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/feedback`);
  console.log(`📍 UI: http://localhost:${PORT}/`);
});
