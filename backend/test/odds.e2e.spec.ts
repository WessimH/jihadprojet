import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Match Odds (e2e)', () => {
  let app: INestApplication;

  const matchId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const teamId = 'a47ac10b-58cc-4372-a567-0e02b2c3d480';

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
  // CREATE MATCH ODDS - VALID CASES
  // ---------------------------------------

  it('POST /match-odds should create match odds with valid data', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post('/match-odds')
      .send({
        match_id: matchId,
        team_id: teamId,
        odds: 1.65,
      })
      .expect(201);

    expect(res.body).toMatch(/This action adds a new matchOdd/);
  });

  it('POST /match-odds should accept minimum odds value', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/match-odds')
      .send({
        match_id: matchId,
        team_id: teamId,
        odds: 1.01, // Minimum allowed
      })
      .expect(201);
  });

  // ---------------------------------------
  // CREATE MATCH ODDS - VALIDATION ERRORS
  // ---------------------------------------

  it('POST /match-odds should reject invalid match_id UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/match-odds')
      .send({
        match_id: 'invalid-uuid',
        team_id: teamId,
        odds: 1.65,
      })
      .expect(400);
  });

  it('POST /match-odds should reject invalid team_id UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/match-odds')
      .send({
        match_id: matchId,
        team_id: 'not-a-uuid',
        odds: 1.65,
      })
      .expect(400);
  });

  it('POST /match-odds should reject odds less than 1.01', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/match-odds')
      .send({
        match_id: matchId,
        team_id: teamId,
        odds: 1.0, // Below minimum
      })
      .expect(400);
  });

  it('POST /match-odds should reject odds equal to 1', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/match-odds')
      .send({
        match_id: matchId,
        team_id: teamId,
        odds: 1, // Below minimum
      })
      .expect(400);
  });

  it('POST /match-odds should reject negative odds', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/match-odds')
      .send({
        match_id: matchId,
        team_id: teamId,
        odds: -0.5,
      })
      .expect(400);
  });

  it('POST /match-odds should forbid extra fields', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/match-odds')
      .send({
        match_id: matchId,
        team_id: teamId,
        odds: 1.65,
        extra_field: 'should-be-rejected',
      })
      .expect(400);
  });

  it('POST /match-odds should require all fields', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/match-odds')
      .send({
        match_id: matchId,
        team_id: teamId,
        // Missing odds
      })
      .expect(400);

    await request(server)
      .post('/match-odds')
      .send({
        match_id: matchId,
        // Missing team_id
        odds: 1.65,
      })
      .expect(400);

    await request(server)
      .post('/match-odds')
      .send({
        // Missing match_id
        team_id: teamId,
        odds: 1.65,
      })
      .expect(400);
  });

  // ---------------------------------------
  // GET MATCH ODDS - UUID VALIDATION
  // ---------------------------------------

  it('GET /match-odds/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).get('/match-odds/invalid-uuid').expect(400);
  });

  it('GET /match-odds/:id should return 404 for non-existent odds', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d999';
    await request(server).get(`/match-odds/${nonExistentId}`).expect(404);
  });

  it('GET /match-odds should return all match odds', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get('/match-odds').expect(200);
    expect(res.body).toMatch(/This action returns all matchOdds/);
  });

  // ---------------------------------------
  // UPDATE MATCH ODDS - VALIDATION
  // ---------------------------------------

  it('PATCH /match-odds/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .patch('/match-odds/invalid-uuid')
      .send({ odds: 2.1 })
      .expect(400);
  });

  it('PATCH /match-odds/:id should return 404 for non-existent odds', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d998';
    await request(server)
      .patch(`/match-odds/${nonExistentId}`)
      .send({ odds: 2.1 })
      .expect(404);
  });

  it('PATCH /match-odds/:id should validate odds on update', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    await request(server)
      .patch(`/match-odds/${validId}`)
      .send({ odds: 0.95 }) // Below minimum
      .expect(400);
  });

  // ---------------------------------------
  // DELETE MATCH ODDS - VALIDATION
  // ---------------------------------------

  it('DELETE /match-odds/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).delete('/match-odds/invalid-uuid').expect(400);
  });

  it('DELETE /match-odds/:id should return 404 for non-existent odds', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d997';
    await request(server).delete(`/match-odds/${nonExistentId}`).expect(404);
  });
});
