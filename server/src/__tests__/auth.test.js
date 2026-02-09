const request = require('supertest');
const app = require('../../server');

describe('Authentication Tests', () => {
  
  // Test 1: Health Check
  test('GET /health - should return 200 and status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('LearnEase-api');
  });

  // Test 2: Register with missing fields
  test('POST /api/auth/register - should fail with missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com' }); // Missing name and password
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing fields');
  });

  // Test 3: Login with invalid credentials
  test('POST /api/auth/login - should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  // Test 4: Access protected route without token
  test('GET /api/auth/me - should fail without authentication', async () => {
    const response = await request(app).get('/api/auth/me');
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
  });

  // Test 5: Login with missing fields
  test('POST /api/auth/login - should fail with missing password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com' }); // Missing password
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing fields');
  });
});
