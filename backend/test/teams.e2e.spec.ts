import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Teams (e2e)', () => {
  let app: INestApplication;
  let teamId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // ---------------------------------------
  // CREATE TEAM
  // ---------------------------------------

  it('POST /teams should create a new team', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post('/teams')
      .send({
        name: 'Test Team',
        tag: 'TST',
        country: 'FR',
        foundedYear: 2024,
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Test Team');
    expect(res.body.tag).toBe('TST');
    expect(res.body.totalEarnings).toBe(0);

    teamId = res.body.id;
  });

  // ---------------------------------------
  // UNIQUE TAG VALIDATION
  // ---------------------------------------

  it('POST /teams should reject creation if tag already exists', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Duplicate Tag Team',
        tag: 'TST',
      })
      .expect(400);
  });

  // ---------------------------------------
  // GET TEAM
  // ---------------------------------------

  it('GET /teams/:id should return a team', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get(`/teams/${teamId}`).expect(200);

    expect(res.body.id).toBe(teamId);
    expect(res.body.tag).toBe('TST');
  });

  // ---------------------------------------
  // LIST TEAMS
  // ---------------------------------------

  it('GET /teams should return an array of teams', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get('/teams').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  // ---------------------------------------
  // UPDATE TEAM
  // ---------------------------------------

  it('PATCH /teams/:id should update a team', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .patch(`/teams/${teamId}`)
      .send({
        name: 'Updated Team Name',
      })
      .expect(200);

    expect(res.body.name).toBe('Updated Team Name');
  });

  // ---------------------------------------
  // LOGO UPLOAD (mock)
  // ---------------------------------------

  it('POST /teams/:id/logo should upload a logo (mock file)', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post(`/teams/${teamId}/logo`)
      .attach('file', Buffer.from('fake-image'), 'logo.png')
      .expect(201);

    expect(res.body.logoUrl).toBeDefined();
    expect(typeof res.body.logoUrl).toBe('string');
  });

  // ---------------------------------------
  // DELETE TEAM
  // ---------------------------------------

  it('DELETE /teams/:id should delete a team', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).delete(`/teams/${teamId}`).expect(204);
  });

  // ---------------------------------------
  // DELETE NON-EXISTENT TEAM
  // ---------------------------------------

  it('DELETE /teams/:id again should return 404', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).delete(`/teams/${teamId}`).expect(404);
  });
});
