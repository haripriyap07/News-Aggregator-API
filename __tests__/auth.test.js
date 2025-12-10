const request = require('supertest');
const express = require('express');
require('dotenv').config(); // Load environment variables
const authRoutes = require('../routes/authRoutes');
const mongoose = require('mongoose');
const User = require('../models/user');

// Create a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  let testUserId;
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpassword123'
  };

  beforeAll(async () => {
    // Connect to MongoDB test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/newsDB_test');
    }
    // Clear users collection before tests
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Clear test data
    await User.deleteMany({});
    // Close connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('username', testUser.username);
      expect(response.body.user).not.toHaveProperty('password');
      
      testUserId = response.body.user.id;
    });

    it('should not register a user with duplicate email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Email already registered');
    });

    it('should not register without required fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'incomplete@example.com' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/login', () => {
    it('should login user with correct credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Logged in successfully');
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should require email and password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Email and password required');
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: testUser.password })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Email and password required');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Email and password required');
    });

    it('should return 400 when email and password are empty strings', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: '', password: '' })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Email and password required');
    });

    it('should return 400 when sending empty JSON', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Email and password required');
    });
  });
});
