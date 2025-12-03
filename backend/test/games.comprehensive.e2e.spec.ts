import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Games (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ---------------------------------------
  // CREATE GAME - VALID CASES
  // ---------------------------------------

  it('POST /games should create game with valid data', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post('/games')
      .send({
        name: 'Counter-Strike 2',
        category: 'FPS',
      })
      .expect(201);

    expect(res.body).toMatch(/This action adds a new game/);
  });

  it('POST /games should accept all valid categories', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const validCategories = [
      'FPS',
      'MOBA',
      'Sports',
      'Fighting',
      'Battle Royale',
    ];

    for (const category of validCategories) {
      await request(server)
        .post('/games')
        .send({
          name: `Test Game ${category}`,
          category,
        })
        .expect(201);
    }
  });

  // ---------------------------------------
  // CREATE GAME - VALIDATION ERRORS
  // ---------------------------------------

  it('POST /games should reject empty name', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/games')
      .send({
        name: '',
        category: 'FPS',
      })
      .expect(400);
  });

  it('POST /games should reject name too long', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const longName = 'a'.repeat(101); // 101 chars, should be max 100
    await request(server)
      .post('/games')
      .send({
        name: longName,
        category: 'FPS',
      })
      .expect(400);
  });

  it('POST /games should reject invalid category', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/games')
      .send({
        name: 'Test Game',
        category: 'INVALID_CATEGORY',
      })
      .expect(400);
  });

  it('POST /games should reject lowercase category', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/games')
      .send({
        name: 'Test Game',
        category: 'fps', // Should be FPS
      })
      .expect(400);
  });

  it('POST /games should reject mixed case category', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/games')
      .send({
        name: 'Test Game',
        category: 'battle royale', // Should be "Battle Royale"
      })
      .expect(400);
  });

  it('POST /games should forbid extra fields', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/games')
      .send({
        name: 'Test Game',
        category: 'FPS',
        extra_field: 'should-be-rejected',
      })
      .expect(400);
  });

  it('POST /games should require all fields', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/games')
      .send({
        name: 'Test Game',
        // Missing category
      })
      .expect(400);

    await request(server)
      .post('/games')
      .send({
        // Missing name
        category: 'FPS',
      })
      .expect(400);
  });

  // ---------------------------------------
  // GET GAME - UUID VALIDATION
  // ---------------------------------------

  it('GET /games/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).get('/games/invalid-uuid').expect(400);
  });

  it('GET /games/:id should return 404 for non-existent game', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d999';
    await request(server).get(`/games/${nonExistentId}`).expect(404);
  });

  it('GET /games should return all games', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get('/games').expect(200);
    expect(res.body).toMatch(/This action returns all games/);
  });

  // ---------------------------------------
  // UPDATE GAME - VALIDATION
  // ---------------------------------------

  it('PATCH /games/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .patch('/games/invalid-uuid')
      .send({ name: 'Updated Game' })
      .expect(400);
  });

  it('PATCH /games/:id should return 404 for non-existent game', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d998';
    await request(server)
      .patch(`/games/${nonExistentId}`)
      .send({ name: 'Updated Game' })
      .expect(404);
  });

  it('PATCH /games/:id should validate DTO on update', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    await request(server)
      .patch(`/games/${validId}`)
      .send({ category: 'invalid-category' })
      .expect(400);
  });

  it('PATCH /games/:id should validate name length on update', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const longName = 'a'.repeat(101);
    await request(server)
      .patch(`/games/${validId}`)
      .send({ name: longName })
      .expect(400);
  });

  // ---------------------------------------
  // DELETE GAME - VALIDATION
  // ---------------------------------------

  it('DELETE /games/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).delete('/games/invalid-uuid').expect(400);
  });

  it('DELETE /games/:id should return 404 for non-existent game', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d997';
    await request(server).delete(`/games/${nonExistentId}`).expect(404);
  });
});
