import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Teams (e2e)', () => {
  let app: INestApplication;
  let _teamId: string;

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
  // CREATE TEAM - VALID CASES
  // ---------------------------------------

  it('POST /teams should create a team with valid data', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post('/teams')
      .send({
        name: 'Team Liquid',
        tag: 'TL',
        country: 'US',
        logo_url: 'https://example.com/logo.png',
        founded_year: 2000,
        total_earnings: 123456.78,
      })
      .expect(201);

    expect(res.body).toMatch(/This action adds a new team/);
    _teamId = 'mock-team-id';
  });

  it('POST /teams should create team with minimal required fields', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Minimal Team',
        tag: 'MIN',
        country: 'FR',
        founded_year: 2020,
        total_earnings: 0,
      })
      .expect(201);
  });

  // ---------------------------------------
  // CREATE TEAM - VALIDATION ERRORS
  // ---------------------------------------

  it('POST /teams should reject empty name', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: '',
        tag: 'TL',
        country: 'US',
        founded_year: 2000,
        total_earnings: 0,
      })
      .expect(400);
  });

  it('POST /teams should reject tag with lowercase letters', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Team Test',
        tag: 'tl', // Should be uppercase
        country: 'US',
        founded_year: 2000,
        total_earnings: 0,
      })
      .expect(400);
  });

  it('POST /teams should reject tag too short', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Team Test',
        tag: 'T', // Only 1 char, should be 2-5
        country: 'US',
        founded_year: 2000,
        total_earnings: 0,
      })
      .expect(400);
  });

  it('POST /teams should reject tag too long', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Team Test',
        tag: 'TOOLONG', // 7 chars, should be 2-5
        country: 'US',
        founded_year: 2000,
        total_earnings: 0,
      })
      .expect(400);
  });

  it('POST /teams should reject lowercase country code', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Team Test',
        tag: 'TL',
        country: 'us', // Should be uppercase
        founded_year: 2000,
        total_earnings: 0,
      })
      .expect(400);
  });

  it('POST /teams should reject invalid URL format', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Team Test',
        tag: 'TL',
        country: 'US',
        logo_url: 'not-a-url',
        founded_year: 2000,
        total_earnings: 0,
      })
      .expect(400);
  });

  it('POST /teams should reject founded_year before 1970', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Team Test',
        tag: 'TL',
        country: 'US',
        founded_year: 1969,
        total_earnings: 0,
      })
      .expect(400);
  });

  it('POST /teams should reject founded_year in future', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const futureYear = new Date().getFullYear() + 1;
    await request(server)
      .post('/teams')
      .send({
        name: 'Team Test',
        tag: 'TL',
        country: 'US',
        founded_year: futureYear,
        total_earnings: 0,
      })
      .expect(400);
  });

  it('POST /teams should reject negative total_earnings', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Team Test',
        tag: 'TL',
        country: 'US',
        founded_year: 2000,
        total_earnings: -100,
      })
      .expect(400);
  });

  it('POST /teams should forbid extra fields', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .post('/teams')
      .send({
        name: 'Team Test',
        tag: 'TL',
        country: 'US',
        founded_year: 2000,
        total_earnings: 0,
        extra_field: 'should-be-rejected',
      })
      .expect(400);
  });

  // ---------------------------------------
  // GET TEAM - UUID VALIDATION
  // ---------------------------------------

  it('GET /teams/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).get('/teams/invalid-uuid').expect(400);
  });

  it('GET /teams/:id should return 404 for non-existent team', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d999';
    await request(server).get(`/teams/${nonExistentId}`).expect(404);
  });

  it('GET /teams should return all teams', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server).get('/teams').expect(200);
    expect(res.body).toMatch(/This action returns all teams/);
  });

  // ---------------------------------------
  // UPDATE TEAM - VALIDATION
  // ---------------------------------------

  it('PATCH /teams/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server)
      .patch('/teams/invalid-uuid')
      .send({ name: 'Updated Name' })
      .expect(400);
  });

  it('PATCH /teams/:id should return 404 for non-existent team', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d998';
    await request(server)
      .patch(`/teams/${nonExistentId}`)
      .send({ name: 'Updated Name' })
      .expect(404);
  });

  it('PATCH /teams/:id should validate DTO on update', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    await request(server)
      .patch(`/teams/${validId}`)
      .send({ tag: 'invalid-lowercase' })
      .expect(400);
  });

  // ---------------------------------------
  // DELETE TEAM - VALIDATION
  // ---------------------------------------

  it('DELETE /teams/:id should reject invalid UUID', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    await request(server).delete('/teams/invalid-uuid').expect(400);
  });

  it('DELETE /teams/:id should return 404 for non-existent team', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const nonExistentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d997';
    await request(server).delete(`/teams/${nonExistentId}`).expect(404);
  });
});
