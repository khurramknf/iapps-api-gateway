// File: api-gateway/backend/src/proxy/proxy.map.ts

import { Options } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';

interface ProxyConfig extends Options { path: string; }

export const proxyConfig = (configService: ConfigService): ProxyConfig[] => {
  return [
    {
      path: '/api/auth',
      target: configService.get('AUTH_SERVICE_URL'),
      pathRewrite: { '^/api/auth': '/auth' },
      changeOrigin: true,
      logLevel: 'debug',
    },
    {
      path: '/api/users',
      target: configService.get('USERS_SERVICE_URL'),
      pathRewrite: { '^/api/users': '/users' },
      changeOrigin: true,
      logLevel: 'debug',
    },
    // ✅ Organizations
    {
      path: '/api/organizations',
      target: configService.get('ORGANIZATIONS_SERVICE_URL'),
      pathRewrite: { '^/api/organizations': '/organizations' },
      changeOrigin: true, logLevel: 'debug',
    },
    // ✅ Businesses
    {
      path: '/api/businesses',
      target: configService.get('BUSINESSES_SERVICE_URL'),
      pathRewrite: { '^/api/businesses': '/businesses' },
      changeOrigin: true, logLevel: 'debug',
    },
    // ✅ Websites
    {
      path: '/api/websites',
      target: configService.get('WEBSITES_SERVICE_URL'),
      pathRewrite: { '^/api/websites': '/websites' },
      changeOrigin: true, logLevel: 'debug',
    },
  ];
};
