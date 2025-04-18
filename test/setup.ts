import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as express from 'express';

declare global {
  var app: INestApplication;
  var configService: ConfigService;
}

module.exports = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [
          join(__dirname, '../.env.test'),
          join(__dirname, '../.env')
        ]
      }),
      AppModule
    ],
  }).compile();

  const app = moduleRef.createNestApplication();

  const server = app.getHttpAdapter().getInstance() as express.Express;

  // ✅ Proxy Middleware Setup
  server.use(
    '/api/auth',
    createProxyMiddleware({
      target: 'http://localhost:3100',
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '/auth' },
      secure: false,
      logLevel: 'debug',
    }),
  );

  server.use(
    '/api/users',
    createProxyMiddleware({
      target: 'http://localhost:3200',
      changeOrigin: true,
      pathRewrite: { '^/api/users': '/users' },
      secure: false,
      logLevel: 'debug',
    }),
  );

  await app.init();

  global.app = app;
  global.configService = app.get(ConfigService);
};
