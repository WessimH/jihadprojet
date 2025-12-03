import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Bets (e2e)', () => {
  let app: INestApplication;

  const userId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const matchId = 'a47ac10b-58cc-4372-a567-0e02b2c3d480';
  const teamId = 'b47ac10b-58cc-4372-a567-0e02b2c3d481';

  let _betId: string;

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

  // ------------------------
  // CREATE BET - VALID CASES
  // ------------------------

  it('POST /bets should create a bet with valid data', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post('/bets')
      .send({
        user_id: userId,
        match_id: matchId,
        team_id: teamId,
        amount: 25.5,
        odds: 1.85,
      })
      .expect(201);

    expect(res.body).toMatch(/This action adds a new bet/);
    _betId = 'mock-bet-id'; // Since service returns string
  });

  // ------------------------
  // CREATE BET - VALIDATION ERRORS
  // ------------------------

  it('POST /bets should reject invalid UUID for user_id', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/bets')
      .send({
        user_id: 'invalid-uuid',
        match_id: matchId,
        team_id: teamId,
        amount: 25,
        odds: 1.85,
      })
      .expect(400);
  });

  it('POST /bets should reject invalid UUID for match_id', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/bets')
      .send({
        user_id: userId,
        match_id: 'not-a-uuid',
        team_id: teamId,
        amount: 25,
        odds: 1.85,
      })
      .expect(400);
  });

  it('POST /bets should reject invalid UUID for team_id', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/bets')
      .send({
        user_id: userId,
        match_id: matchId,
        team_id: 'bad-uuid',
        amount: 25,
        odds: 1.85,
      })
      .expect(400);
  });

  it('POST /bets should reject amount less than 0.01', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/bets')
      .send({
        user_id: userId,
        match_id: matchId,
        team_id: teamId,
        amount: 0.005,
        odds: 1.85,
      })
      .expect(400);
  });

  it('POST /bets should reject odds less than 1', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/bets')
      .send({
        user_id: userId,
        match_id: matchId,
        team_id: teamId,
        amount: 25,
        odds: 0.95,
      })
      .expect(400);
  });

  it('POST /bets should forbid potential_payout in request', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/bets')
      .send({
        user_id: userId,
        match_id: matchId,
        team_id: teamId,
        amount: 25,
        odds: 1.85,
        potential_payout: 100, // Should be forbidden
      })
      .expect(400);
  });

  it('POST /bets should reject extra fields', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/bets')
      .send({
        user_id: userId,
        match_id: matchId,
        team_id: teamId,
        amount: 25,
        odds: 1.85,
        extra_field: 'should-be-rejected',
      })
      .expect(400);
  });

  it('POST /bets should reject missing required fields', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/bets')
      .send({
        user_id: userId,
        match_id: matchId,
        // missing team_id, amount, odds
      })
      .expect(400);
  });

  // ------------------------
  // GET BET - UUID VALIDATION
  // ------------------------

  it('GET /bets/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).get('/bets/invalid-uuid').expect(400);
  });

  it('GET /bets/:id should return 404 for non-existent bet', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'c47ac10b-58cc-4372-a567-0e02b2c3d482';
    await request(server).get(`/bets/${nonExistentId}`).expect(404);
  });

  it('GET /bets should return all bets', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get('/bets').expect(200);
    expect(res.body).toMatch(/This action returns all bets/);
  });

  // ------------------------
  // UPDATE BET - UUID VALIDATION
  // ------------------------

  it('PATCH /bets/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .patch('/bets/invalid-uuid')
      .send({ amount: 30 })
      .expect(400);
  });

  it('PATCH /bets/:id should return 404 for non-existent bet', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'c47ac10b-58cc-4372-a567-0e02b2c3d483';
    await request(server)
      .patch(`/bets/${nonExistentId}`)
      .send({ amount: 30 })
      .expect(404);
  });

  // ------------------------
  // DELETE BET - UUID VALIDATION
  // ------------------------

  it('DELETE /bets/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).delete('/bets/invalid-uuid').expect(400);
  });

  it('DELETE /bets/:id should return 404 for non-existent bet', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'c47ac10b-58cc-4372-a567-0e02b2c3d484';
    await request(server).delete(`/bets/${nonExistentId}`).expect(404);
  });
});
