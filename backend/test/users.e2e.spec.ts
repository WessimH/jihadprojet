import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer() as unknown as HttpServer;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users creates user (201), hash password, email unique, balance default 0', async () => {
    const email = `user${Date.now()}@mail.test`;
    const payload = { email, password: 'secret123' };
    const res = await request(server).post('/users').send(payload).expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', email);
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).toHaveProperty('balance', 0);

    // Email unique
    await request(server).post('/users').send(payload).expect(409);
  });

  it('POST /auth/login returns access_token, 401 on bad password', async () => {
    const email = `login${Date.now()}@mail.test`;
    const password = 'secret123';
    await request(server).post('/users').send({ email, password }).expect(201);

    const ok = await request(server)
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    expect(ok.body).toHaveProperty('access_token');

    await request(server)
      .post('/auth/login')
      .send({ email, password: 'wrong' })
      .expect(401);
  });

  it('GET /users/:id returns user without password_hash', async () => {
    const email = `get${Date.now()}@mail.test`;
    const password = 'secret123';
    const created = await request(server)
      .post('/users')
      .send({ email, password })
      .expect(201);
    const id = created.body.id;
    const res = await request(server).get(`/users/${id}`).expect(200);
    expect(res.body).toHaveProperty('id', id);
    expect(res.body).toHaveProperty('email', email);
    expect(res.body).not.toHaveProperty('password_hash');
  });
});
