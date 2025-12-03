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

  // ---------------------------------------
  // CREATE USER - VALID CASES
  // ---------------------------------------

  it('POST /users should create user with valid data', async () => {
    const res = await request(server)
      .post('/users')
      .send({
        username: 'alice',
        email: 'alice@example.com',
        password: 'Str0ngPass1',
        balance: 0,
      })
      .expect(201);

    expect(res.body).toMatch(/This action adds a new user/);
  });

  it('POST /users should create user with minimal data', async () => {
    await request(server)
      .post('/users')
      .send({
        username: 'bob',
        email: 'bob@example.com',
        password: 'ValidPass123',
      })
      .expect(201);
  });

  // ---------------------------------------
  // CREATE USER - VALIDATION ERRORS
  // ---------------------------------------

  it('POST /users should reject username too short', async () => {
    await request(server)
      .post('/users')
      .send({
        username: 'ab', // Only 2 chars, should be 3-50
        email: 'test@example.com',
        password: 'ValidPass123',
      })
      .expect(400);
  });

  it('POST /users should reject username too long', async () => {
    const longUsername = 'a'.repeat(51); // 51 chars, should be 3-50
    await request(server)
      .post('/users')
      .send({
        username: longUsername,
        email: 'test@example.com',
        password: 'ValidPass123',
      })
      .expect(400);
  });

  it('POST /users should reject username with spaces', async () => {
    await request(server)
      .post('/users')
      .send({
        username: 'user name', // Contains space
        email: 'test@example.com',
        password: 'ValidPass123',
      })
      .expect(400);
  });

  it('POST /users should reject invalid email', async () => {
    await request(server)
      .post('/users')
      .send({
        username: 'testuser',
        email: 'not-an-email',
        password: 'ValidPass123',
      })
      .expect(400);
  });

  it('POST /users should reject weak password (no uppercase)', async () => {
    await request(server)
      .post('/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'weakpass1', // No uppercase
      })
      .expect(400);
  });

  it('POST /users should reject weak password (no lowercase)', async () => {
    await request(server)
      .post('/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'WEAKPASS1', // No lowercase
      })
      .expect(400);
  });

  it('POST /users should reject weak password (no digit)', async () => {
    await request(server)
      .post('/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'WeakPass', // No digit
      })
      .expect(400);
  });

  it('POST /users should reject negative balance', async () => {
    await request(server)
      .post('/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPass123',
        balance: -10,
      })
      .expect(400);
  });

  it('POST /users should forbid extra fields', async () => {
    await request(server)
      .post('/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPass123',
        extra_field: 'should-be-rejected',
      })
      .expect(400);
  });

  // ---------------------------------------
  // GET USER - UUID VALIDATION
  // ---------------------------------------

  it('GET /users/:id should reject invalid UUID', async () => {
    await request(server).get('/users/invalid-uuid').expect(400);
  });

  it('GET /users/:id should return 404 for non-existent user', async () => {
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d999';
    await request(server).get(`/users/${nonExistentId}`).expect(404);
  });

  it('GET /users should return all users', async () => {
    const res = await request(server).get('/users').expect(200);
    expect(res.body).toMatch(/This action returns all users/);
  });

  // ---------------------------------------
  // UPDATE USER - VALIDATION
  // ---------------------------------------

  it('PATCH /users/:id should reject invalid UUID', async () => {
    await request(server)
      .patch('/users/invalid-uuid')
      .send({ username: 'newname' })
      .expect(400);
  });

  it('PATCH /users/:id should return 404 for non-existent user', async () => {
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d998';
    await request(server)
      .patch(`/users/${nonExistentId}`)
      .send({ username: 'newname' })
      .expect(404);
  });

  it('PATCH /users/:id should validate DTO on update', async () => {
    const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    await request(server)
      .patch(`/users/${validId}`)
      .send({ username: 'ab' }) // Too short
      .expect(400);
  });

  // ---------------------------------------
  // DELETE USER - VALIDATION
  // ---------------------------------------

  it('DELETE /users/:id should reject invalid UUID', async () => {
    await request(server).delete('/users/invalid-uuid').expect(400);
  });

  it('DELETE /users/:id should return 404 for non-existent user', async () => {
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d997';
    await request(server).delete(`/users/${nonExistentId}`).expect(404);
  });
});
