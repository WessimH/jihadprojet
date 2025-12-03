import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Matches (e2e)', () => {
  let app: INestApplication;

  const tournamentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const team1Id = 'a47ac10b-58cc-4372-a567-0e02b2c3d480';
  const team2Id = 'b47ac10b-58cc-4372-a567-0e02b2c3d481';
  const gameId = 'c47ac10b-58cc-4372-a567-0e02b2c3d482';

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
  // CREATE MATCH - VALID CASES
  // ---------------------------------------

  it('POST /matches should create match with valid data', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(201);

    expect(res.body).toMatch(/This action adds a new match/);
  });

  it('POST /matches should create match with minimal data', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-04T20:00:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO1',
      })
      .expect(201);
  });

  // ---------------------------------------
  // CREATE MATCH - UUID VALIDATION
  // ---------------------------------------

  it('POST /matches should reject invalid tournament_id UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: 'invalid-uuid',
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(400);
  });

  it('POST /matches should reject invalid team1_id UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: 'bad-uuid',
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(400);
  });

  it('POST /matches should reject invalid team2_id UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: 'invalid',
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(400);
  });

  it('POST /matches should reject invalid game_id UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: 'not-uuid',
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(400);
  });

  // ---------------------------------------
  // DATE VALIDATION
  // ---------------------------------------

  it('POST /matches should reject invalid date format', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: 'not-a-date',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(400);
  });

  it('POST /matches should accept various ISO date formats', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-05T14:30:00Z', // Different format but valid
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO5',
      })
      .expect(201);
  });

  // ---------------------------------------
  // ENUM VALIDATION
  // ---------------------------------------

  it('POST /matches should reject lowercase status', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'scheduled', // Should be SCHEDULED
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(400);
  });

  it('POST /matches should reject invalid status', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'INVALID_STATUS',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(400);
  });

  it('POST /matches should accept all valid status values', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const validStatuses = ['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'];

    for (const status of validStatuses) {
      await request(server)
        .post('/matches')
        .send({
          tournament_id: tournamentId,
          team1_id: team1Id,
          team2_id: team2Id,
          game_id: gameId,
          match_date: '2025-12-03T18:45:00.000Z',
          status,
          team1_score: 0,
          team2_score: 0,
          format: 'BO3',
        })
        .expect(201);
    }
  });

  it('POST /matches should reject lowercase format', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'bo3', // Should be BO3
      })
      .expect(400);
  });

  it('POST /matches should reject invalid format', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO7', // Invalid format
      })
      .expect(400);
  });

  it('POST /matches should accept all valid format values', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const validFormats = ['BO1', 'BO3', 'BO5'];

    for (const format of validFormats) {
      await request(server)
        .post('/matches')
        .send({
          tournament_id: tournamentId,
          team1_id: team1Id,
          team2_id: team2Id,
          game_id: gameId,
          match_date: '2025-12-03T18:45:00.000Z',
          status: 'SCHEDULED',
          team1_score: 0,
          team2_score: 0,
          format,
        })
        .expect(201);
    }
  });

  // ---------------------------------------
  // SCORE VALIDATION
  // ---------------------------------------

  it('POST /matches should reject negative team1_score', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: -1,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(400);
  });

  it('POST /matches should reject negative team2_score', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: -5,
        format: 'BO3',
      })
      .expect(400);
  });

  // ---------------------------------------
  // BUSINESS LOGIC VALIDATION
  // ---------------------------------------

  it('POST /matches should reject when team1_id equals team2_id', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team1Id, // Same as team1_id
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      })
      .expect(400);
  });

  it('POST /matches should validate winner_id is one of the teams', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const invalidWinnerId = 'e47ac10b-58cc-4372-a567-0e02b2c3d483';
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'COMPLETED',
        team1_score: 2,
        team2_score: 1,
        winner_id: invalidWinnerId, // Not team1 or team2
        format: 'BO3',
      })
      .expect(400);
  });

  // ---------------------------------------
  // FORBIDDEN FIELDS
  // ---------------------------------------

  it('POST /matches should forbid extra fields', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        game_id: gameId,
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
        extra_field: 'should-be-rejected',
      })
      .expect(400);
  });

  // ---------------------------------------
  // GET MATCH - UUID VALIDATION
  // ---------------------------------------

  it('GET /matches/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).get('/matches/invalid-uuid').expect(400);
  });

  it('GET /matches/:id should return 404 for non-existent match', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d999';
    await request(server).get(`/matches/${nonExistentId}`).expect(404);
  });

  it('GET /matches should return all matches', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get('/matches').expect(200);
    expect(res.body).toMatch(/This action returns all matches/);
  });

  // ---------------------------------------
  // UPDATE MATCH - VALIDATION
  // ---------------------------------------

  it('PATCH /matches/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .patch('/matches/invalid-uuid')
      .send({ status: 'LIVE' })
      .expect(400);
  });

  it('PATCH /matches/:id should return 404 for non-existent match', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d998';
    await request(server)
      .patch(`/matches/${nonExistentId}`)
      .send({ status: 'LIVE' })
      .expect(404);
  });

  it('PATCH /matches/:id should validate DTO on update', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    await request(server)
      .patch(`/matches/${validId}`)
      .send({ status: 'invalid-status' })
      .expect(400);
  });

  // ---------------------------------------
  // DELETE MATCH - VALIDATION
  // ---------------------------------------

  it('DELETE /matches/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).delete('/matches/invalid-uuid').expect(400);
  });

  it('DELETE /matches/:id should return 404 for non-existent match', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d997';
    await request(server).delete(`/matches/${nonExistentId}`).expect(404);
  });
});
