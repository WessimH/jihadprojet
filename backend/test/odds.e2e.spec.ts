import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server as HttpServer } from 'http';

describe('Match Odds (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /odds should create 2 odds for a match', async () => {
    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .post('/odds')
      .send({
        matchId: 'test-id',
        odds: [
          { teamId: 'team-1', value: 1.7 },
          { teamId: 'team-2', value: 2.4 },
        ],
      })
      .expect(201);

    expect(res.body).toHaveLength(2);
  });

  it('PATCH /odds/:id should update odds and timestamp', async () => {
    const id = 'test-odd-id';

    const server = app.getHttpServer() as unknown as HttpServer;
    const res = await request(server)
      .patch(`/odds/${id}`)
      .send({ value: 2.1 })
      .expect(200);

    expect(res.body.value).toBe(2.1);
  });
});
