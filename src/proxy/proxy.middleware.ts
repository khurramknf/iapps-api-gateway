// File: services/api-gateway/backend/src/proxy/proxy.middleware.ts

import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

export function setupProxies(app: any, configService: ConfigService) {
  const authTarget = configService.get('AUTH_SERVICE_URL');
  const usersTarget = configService.get('USERS_SERVICE_URL');

  // 🔐 Auth Proxy
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: authTarget,
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '/auth' },
      onProxyReq: fixRequestBody,
      onProxyRes(proxyRes, req: Request, res: Response) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      },
      onError(err, req, res) {
        console.error('Auth proxy error:', err.message);
        res.status(500).json({ error: 'Auth service unavailable' });
      },
      logLevel: 'debug',
    })
  );

  // 👥 Users Proxy
  app.use(
    '/api/users',
    createProxyMiddleware({
      target: usersTarget,
      changeOrigin: true,
      pathRewrite: { '^/api/users': '/users' },
      onProxyReq: fixRequestBody,
      onProxyRes(proxyRes, req: Request, res: Response) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      },
      onError(err, req, res) {
        console.error('Users proxy error:', err.message);
        res.status(500).json({ error: 'Users service unavailable' });
      },
      logLevel: 'debug',
    })
  );
}
