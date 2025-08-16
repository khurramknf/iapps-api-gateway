import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('Gateway Contracts', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(() => app.close());

  it('proxies /api/auth/login to auth-service', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'admin@iapps.com', password: 'password' });
    expect([200,201]).toContain(res.status);
    expect(res.body).toHaveProperty('access_token');
  });

  it('proxies /api/businesses to businesses-service and enforces JWT', async () => {
    const res = await request(server).get('/api/businesses');
    expect(res.status).toBe(401);
  });
});
