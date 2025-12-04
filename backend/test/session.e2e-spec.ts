import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Session e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a user, logs in, manages session lifecycle and revokes token', async () => {
    const username = 'sessionuser';
    const email = 'sessionuser@example.com';
    const password = 'Str0ngPass1!';

    // create user
    const createRes = await request(app.getHttpServer() as unknown as App)
      .post('/users')
      .send({ username, email, password, balance: 0 })
      .expect(201);

    const created = createRes.body;
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();

    // login
    const loginRes = await request(app.getHttpServer() as unknown as App)
      .post('/auth/login')
      .send({ username, password })
      .expect(200);

    expect(loginRes.body).toBeDefined();
    const token = loginRes.body.access_token;
    const jti = loginRes.body.jti;
    expect(typeof token).toBe('string');
    expect(typeof jti).toBe('string');

    // list sessions
    const listRes = await request(app.getHttpServer() as unknown as App)
      .get('/auth/login')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    const found = (listRes.body as Array<Record<string, unknown>>).find(
      (s) => s.id === jti,
    );
    expect(found).toBeDefined();

    // get session
    const getRes = await request(app.getHttpServer() as unknown as App)
      .get(`/auth/login/${jti}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getRes.body).toBeDefined();
    expect(getRes.body.id).toBe(jti);

    // delete session (revoke)
    const delRes = await request(app.getHttpServer() as unknown as App)
      .delete(`/auth/login/${jti}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(delRes.body).toBeDefined();
    expect(delRes.body.ok).toBe(true);

    // token should now be rejected when accessing a protected route
    await request(app.getHttpServer() as unknown as App)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    // after revocation the same token is rejected by the guard (unauthorized)
    await request(app.getHttpServer() as unknown as App)
      .get(`/auth/login/${jti}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
