import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Dashboard / Views (e2e)', () => {
  let app: INestApplication;

  const userId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // -------------------------------
  // UPCOMING MATCHES
  // -------------------------------

  it('GET /views/upcoming-matches returns scheduled matches sorted by date', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .get('/views/upcoming-matches')
      .expect(200);

    const body: Array<{
      format: string;
      team1_name: string;
      team2_name: string;
      game_name: string;
      match_date: string | number | Date;
    }> = res.body;

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    // Vérifie que tous les matchs sont scheduled
    body.forEach((m) => {
      expect(m.format).toBeDefined();
      expect(m.team1_name).toBeDefined();
      expect(m.team2_name).toBeDefined();
      expect(m.game_name).toBeDefined();
    });

    // Vérifie tri par date ascendante
    const dates = body.map((m) => new Date(m.match_date).getTime());
    const sorted = [...dates].sort((a, b) => a - b);
    expect(dates).toEqual(sorted);
  });

  // -------------------------------
  // RESULTS
  // -------------------------------

  it('GET /views/results returns completed matches with scores and winner', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get('/views/results').expect(200);

    const body: Array<{
      team1_score: number;
      team2_score: number;
      winner_name: string;
      team1_logo: string;
      team2_logo: string;
      game_name: string;
    }> = res.body;

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    body.forEach((m) => {
      expect(m.team1_score).toBeDefined();
      expect(m.team2_score).toBeDefined();
      expect(m.winner_name).toBeDefined();
      expect(m.team1_logo).toBeDefined();
      expect(m.team2_logo).toBeDefined();
      expect(m.game_name).toBeDefined();
    });
  });

  // -------------------------------
  // USER SUMMARY (profit / total_bet / total_won)
  // -------------------------------

  it('GET /views/user-summary/:id returns total bet, total won, profit', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .get(`/views/user-summary/${userId}`)
      .expect(200);

    expect(res.body.totalBet).toBeDefined();
    expect(res.body.totalWon).toBeDefined();
    expect(res.body.profit).toBeDefined();
    expect(typeof res.body.profit).toBe('number');
  });
});
