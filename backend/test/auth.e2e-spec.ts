import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // ensure the app uses sqlite in-memory
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

  it('creates a user, logs in, and retrieves profile', async () => {
    const username = 'e2eadmin';
    const email = 'e2eadmin@example.com';
    const password = 'Str0ngPass1';

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
    expect(typeof token).toBe('string');

    // access protected profile
    const profileRes = await request(app.getHttpServer() as unknown as App)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileRes.body).toBeDefined();
    expect(profileRes.body.user).toBeDefined();
    expect(profileRes.body.user.username).toBe(username);
  });
});
