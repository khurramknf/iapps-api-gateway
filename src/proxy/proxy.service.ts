// services/api-gateway/backend/src/proxy/proxy.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { Request, Response } from 'express';

@Injectable()
export class ProxyService {
  constructor(private configService: ConfigService) {}

  createAuthProxy() {
    const target = this.configService.get('AUTH_SERVICE_URL');
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '/auth' },
      secure: false,
      logLevel: 'debug',
      ws: true,
      xfwd: true,
      onProxyReq: fixRequestBody,
      onProxyRes(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      },
      onError: (err: Error, req: Request, res: Response) => {
        res.status(503).json({
          message: 'Auth Service is unavailable',
        });
      },
    });
  }

  createUsersProxy() {
    const target = this.configService.get('USERS_SERVICE_URL');
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { '^/api/users': '/users' },
      secure: false,
      logLevel: 'debug',
      ws: true,
      xfwd: true,
      onProxyReq: fixRequestBody,
      onProxyRes(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      },
      onError: (err: Error, req: Request, res: Response) => {
        res.status(503).json({
          message: 'Users Service is unavailable',
        });
      },
    });
  }
}
