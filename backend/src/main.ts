import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Enable CORS for frontend
    app.enableCors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    });

    // Global input validation: strips unknown properties, rejects extra fields,
    // auto-transforms primitives, and runs class-validator on DTOs
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        validateCustomDecorators: true,
      }),
    );

    // Swagger/OpenAPI setup
    const config = new DocumentBuilder()
      .setTitle('JihadProjet API')
      .setDescription('API documentation for the backend')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      jsonDocumentUrl: 'api-json',
      swaggerOptions: { persistAuthorization: true },
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`📚 Swagger documentation: http://localhost:${port}/api`);
  } catch (error) {
    // Handle database connection errors
    if (
      error instanceof Error &&
      (error.message.includes('ECONNREFUSED') ||
        error.message.includes('connect') ||
        error.message.includes('database') ||
        error.message.includes('ETIMEDOUT') ||
        error.message.includes('getaddrinfo'))
    ) {
      logger.error('❌ ========================================');
      logger.error('❌ DATABASE CONNECTION FAILED');
      logger.error('❌ ========================================');
      logger.error('');
      logger.error('🔍 Possible causes:');
      logger.error('   1. PostgreSQL is not running');
      logger.error('   2. Wrong database credentials in .env');
      logger.error('   3. Database host/port is incorrect');
      logger.error('   4. Docker container is not started');
      logger.error('');
      logger.error('💡 Solutions:');
      logger.error('   - Start PostgreSQL: docker-compose up -d db');
      logger.error('   - Check .env file configuration');
      logger.error('   - Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD');
      logger.error('');
      logger.error(`🔧 Error details: ${error.message}`);
      logger.error('❌ ========================================');
    } else {
      logger.error('❌ Failed to start application:', error);
    }

    process.exit(1);
  }
}

void bootstrap();
