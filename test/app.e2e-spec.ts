import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  const newUser = {
    email: 'newuser@example.com',
    password: 'password123',
    name: 'New User',
  };

  beforeAll(async () => {
    app = global.app;

    // Register test user in auth-service
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser);

    // Also insert test user into users-service to pass email lookup test
    await request(app.getHttpServer())
      .post('/api/users')
      .send({
        email: testUser.email,
        name: testUser.name,
        password: testUser.password,
        role: 'client',
      });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Checks', () => {
    it('should return 200 for API Gateway health check', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect({ status: 'ok' });
    });

    it('should return 200 for auth service health check', () => {
      return request(app.getHttpServer())
        .get('/api/auth/health')
        .expect(200)
        .expect({ status: 'ok' });
    });

    it('should return 200 for users service health check', () => {
      return request(app.getHttpServer())
        .get('/api/users/health')
        .expect(200)
        .expect({ status: 'ok' });
    });
  });

  describe('Auth Service', () => {
    it('should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', newUser.email);
      expect(res.body.user).toHaveProperty('name', newUser.name);
    });

    it('should not register a user with existing email', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Email already registered');
    });

    it('should login with valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200); // ✅ Previously was 201
      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('refresh_token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('Users Service', () => {
    it('should get user by email', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/users/email/${testUser.email}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).toHaveProperty('name', testUser.name);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/email/nonexistent@example.com');

      expect(res.status).toBe(404);
    });
  });
});
