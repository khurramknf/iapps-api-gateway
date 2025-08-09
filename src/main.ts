// File: api-gateway/backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import cors from 'cors';
import { setupProxies } from './proxy/setupProxies';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const server = app.getHttpAdapter().getInstance() as express.Express;

  const origins = (configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim());

  server.use(
    cors({
      origin: origins,
      credentials: true, // ✅ allow cookies
    }),
  );
  server.options('*', cors());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  setupProxies(server, configService);

  server.use('/api', (req, res) => {
    res.status(404).json({
      statusCode: 404,
      message: `Route not found: ${req.originalUrl}`,
    });
  });

  const port = configService.get('PORT') || 3002;
  await app.listen(port);
  console.log(`🚀 API Gateway running at http://localhost:${port}`);
}
bootstrap();
