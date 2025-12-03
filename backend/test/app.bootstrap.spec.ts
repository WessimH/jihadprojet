import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Server } from 'http';

describe('App bootstrap (e2e)', () => {
  let app: INestApplication;
  // Use a typed http.Server to satisfy strict eslint rules for supertest
  let server: Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    // Mount Swagger for test environment
    const config = new DocumentBuilder()
      .setTitle('Esport Betting API')
      .setDescription('Swagger test')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    await app.init();
    // Cache typed http server once app is initialized
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  // --------------------------------------
  // SANITY CHECK
  // --------------------------------------

  it('app should be defined', () => {
    expect(app).toBeDefined();
  });

  // --------------------------------------
  // SWAGGER JSON EXISTS
  // --------------------------------------

  it('GET /swagger-json should return OpenAPI schema', async () => {
    const res = await request(server).get('/swagger-json').expect(200);

    expect(res.body.openapi).toBeDefined();
    expect(res.body.paths).toBeDefined();
  });

  // --------------------------------------
  // basic health check
  // --------------------------------------

  it('App should respond to / (Swagger UI)', async () => {
    await request(server).get('/').expect(200);
  });
});
