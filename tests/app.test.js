const request = require('supertest');
const app = require('../src/app');

describe('Feedback Management System - Integration Tests', () => {
  
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /metrics', () => {
    it('should return prometheus metrics in text format', async () => {
      // generate a couple of requests to change counters
      await request(app).get('/health');
      await request(app).get('/api/feedback');

      const res = await request(app).get('/metrics');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('text/plain');
      expect(res.text).toMatch(/http_requests_total \d+/);
      expect(res.text).toMatch(/feedbacks_total \d+/);
    });
  });

  describe('GET /api/feedback', () => {
    it('should return feedback array with success flag', async () => {
      const res = await request(app).get('/api/feedback');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/feedback', () => {
    it('should create new feedback successfully', async () => {
      const feedbackData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Great service!',
        rating: 5
      };

      const res = await request(app)
        .post('/api/feedback')
        .send(feedbackData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('John Doe');
      expect(res.body.data.rating).toBe(5);
      expect(res.body.data).toHaveProperty('createdAt');
    });

    it('should fail without required fields', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .send({ name: 'Test' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('All fields are required');
    });

    it('should validate rating range', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .send({
          name: 'Test',
          email: 'test@test.com',
          message: 'Test',
          rating: 6
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Rating must be between 1 and 5');
    });

    it.skip('should accept feedback without rating', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Good service'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBeNull();
    });
  });

  describe('GET /api/feedback/:id', () => {
    it('should get feedback by id', async () => {
      // First create feedback
      const createRes = await request(app)
        .post('/api/feedback')
        .send({
          name: 'Jane',
          email: 'jane@test.com',
          message: 'Nice',
          rating: 4
        });

      const id = createRes.body.data.id;

      // Then get it
      const res = await request(app).get(`/api/feedback/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.id).toBe(id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await request(app).get('/api/feedback/99999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Feedback not found');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Route not found');
    });
  });

  describe('Error handler', () => {
    it('should return 500 when an error is thrown', async () => {
      // The /error-trigger route is defined in app.js when NODE_ENV === 'test'
      const res = await request(app).get('/error-trigger');
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Internal server error');
    });
  });
});