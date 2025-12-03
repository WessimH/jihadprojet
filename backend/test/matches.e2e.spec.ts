import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Matches (e2e)', () => {
  let app: INestApplication;

  // Fake UUIDs for teams and game (use real seeded ones if needed)
  const team1Id = '11111111-1111-1111-1111-111111111111';
  const team2Id = '22222222-2222-2222-2222-222222222222';
  const gameId = '33333333-3333-3333-3333-333333333333';

  let createdMatchId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // CREATE MATCH
  it('POST /matches should create a match', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post('/matches')
      .send({
        tournamentId: null,
        team1Id,
        team2Id,
        gameId,
        matchDate: '2024-12-12T18:00:00Z',
        format: 'Bo3',
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('scheduled');
    expect(res.body.team1Id).toBe(team1Id);
    expect(res.body.team2Id).toBe(team2Id);

    createdMatchId = res.body.id;
  });

  // VALIDATION: team1 != team2
  it('POST /matches should fail if team1 == team2', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/matches')
      .send({
        team1Id: team1Id,
        team2Id: team1Id,
        gameId,
        matchDate: '2024-12-12T18:00:00Z',
      })
      .expect(400);
  });

  // GET MATCH
  it('GET /matches/:id should return match', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .get(`/matches/${createdMatchId}`)
      .expect(200);

    expect(res.body.id).toBe(createdMatchId);
    expect(res.body.status).toBe('scheduled');
  });

  // LIST MATCHES
  it('GET /matches should return an array', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get('/matches').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  // UPDATE MATCH: set status to live
  it('PATCH /matches/:id should update match status to live', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .patch(`/matches/${createdMatchId}`)
      .send({ status: 'live' })
      .expect(200);

    expect(res.body.status).toBe('live');
  });

  // UPDATE SCORE (only allowed if status == live)
  it('PATCH /matches/:id should update score only when live', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .patch(`/matches/${createdMatchId}`)
      .send({
        team1Score: 1,
        team2Score: 0,
      })
      .expect(200);

    expect(res.body.team1Score).toBe(1);
    expect(res.body.team2Score).toBe(0);
  });

  // FINISH MATCH
  it('PATCH /matches/:id should set winner when completed', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .patch(`/matches/${createdMatchId}`)
      .send({
        status: 'completed',
        winnerId: team1Id,
      })
      .expect(200);

    expect(res.body.status).toBe('completed');
    expect(res.body.winnerId).toBe(team1Id);
  });

  // DELETE MATCH
  it('DELETE /matches/:id should delete match', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).delete(`/matches/${createdMatchId}`).expect(204);
  });
});
