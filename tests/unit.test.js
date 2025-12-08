describe('Feedback Validation - Unit Tests', () => {
  
  const validateFeedback = (data) => {
    const { name, email, message, rating } = data;
    
    if (!name || !email || !message || rating === undefined) {
      return { valid: false, error: 'Missing required fields' };
    }
    
    if (rating < 1 || rating > 5) {
      return { valid: false, error: 'Rating must be between 1 and 5' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }
    
    return { valid: true };
  };

  it('should validate correct feedback data', () => {
    const result = validateFeedback({
      name: 'Test',
      email: 'test@test.com',
      message: 'Good',
      rating: 5
    });
    expect(result.valid).toBe(true);
  });

  it('should reject missing fields', () => {
    const result = validateFeedback({
      name: 'Test',
      email: 'test@test.com'
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Missing required fields');
  });

  it('should reject invalid rating', () => {
    const result = validateFeedback({
      name: 'Test',
      email: 'test@test.com',
      message: 'Test',
      rating: 10
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Rating must be between 1 and 5');
  });

  it('should reject invalid email', () => {
    const result = validateFeedback({
      name: 'Test',
      email: 'invalid-email',
      message: 'Test',
      rating: 5
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid email format');
  });
});
