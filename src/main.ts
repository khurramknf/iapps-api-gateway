// File: services/api-gateway/backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as express from 'express';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get Express instance
  const server = app.getHttpAdapter().getInstance() as express.Express;

  // 🔥 Apply full manual CORS (before proxy)
  server.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
    })
  );

  // ✅ Handle preflight (OPTIONS) manually to prevent 403
  server.options('*', cors());

  // Proxy: Auth Service
  server.use(
    '/api/auth',
    createProxyMiddleware({
      target: 'http://localhost:3100',
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '/auth' },
      secure: false,
      logLevel: 'debug',
    })
  );

  // Proxy: Users Service
  server.use(
    '/api/users',
    createProxyMiddleware({
      target: 'http://localhost:3200',
      changeOrigin: true,
      pathRewrite: { '^/api/users': '/users' },
      secure: false,
      logLevel: 'debug',
    })
  );

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get('PORT') || 3002;
  await app.listen(port);
  console.log(`🚀 API Gateway running at http://localhost:${port}`);
}
bootstrap();
