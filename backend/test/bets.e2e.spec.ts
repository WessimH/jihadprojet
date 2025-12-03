import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Bets (e2e)', () => {
  let app: INestApplication;

  const userId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const matchId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const teamId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

  let betId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // ------------------------
  // CREATE BET
  // ------------------------

  it('POST /bets should place a bet if user has balance & match is scheduled', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post('/bets')
      .send({
        userId,
        matchId,
        teamId,
        amount: 50,
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.amount).toBe(50);
    expect(res.body.status).toBe('pending');
    expect(res.body.potentialPayout).toBeGreaterThan(50);

    betId = res.body.id;
  });

  // ------------------------
  // VALIDATIONS
  // ------------------------

  it('POST /bets should reject bet if user balance < amount', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/bets')
      .send({
        userId,
        matchId,
        teamId,
        amount: 999999,
      })
      .expect(400);
  });

  it('POST /bets should reject bet if match is not scheduled', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .patch(`/matches/${matchId}`)
      .send({ status: 'live' })
      .expect(200);

    await request(server)
      .post('/bets')
      .send({
        userId,
        matchId,
        teamId,
        amount: 20,
      })
      .expect(400);

    await request(server) // remet match scheduled pour la suite
      .patch(`/matches/${matchId}`)
      .send({ status: 'scheduled' })
      .expect(200);
  });

  // ------------------------
  // GET BET
  // ------------------------
  it('GET /bets/:id should return bet', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get(`/bets/${betId}`).expect(200);

    expect(res.body.id).toBe(betId);
    expect(res.body.status).toBe('pending');
  });

  // ------------------------
  // HISTORY
  // ------------------------
  it('GET /bets/user/:userId should list user bets', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get(`/bets/user/${userId}`).expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  // ------------------------
  // ODDS UPDATE IMPACT PAYOUT
  // ------------------------
  it('Updating odds should recalculate future potential payout', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const oldBet = await request(server).get(`/bets/${betId}`).expect(200);
    const oldPayout = Number(oldBet.body.potentialPayout ?? 0);
    await request(server)
      .patch(`/odds/${teamId}-${matchId}`)
      .send({ value: 3.0 }) // nouvelle cote
      .expect(200);
    const updatedBet = await request(server).get(`/bets/${betId}`).expect(200);
    expect(Number(updatedBet.body.potentialPayout ?? 0)).toBeGreaterThan(
      oldPayout,
    );
  });

  // ------------------------
  // PAYOUT AFTER MATCH RESULT
  // ------------------------
  it('Completing match updates bet status & balance', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .patch(`/matches/${matchId}`)
      .send({
        status: 'completed',
        winnerId: teamId,
      })
      .expect(200);
    const bet = await request(server).get(`/bets/${betId}`).expect(200);

    expect(bet.body.status).toBe('won');
    expect(Number(bet.body.potentialPayout ?? 0)).toBeGreaterThan(0);
  });
});
