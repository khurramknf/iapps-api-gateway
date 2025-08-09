// File: api-gateway/backend/src/proxy/proxy.map.ts

import { Options } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';

interface ProxyConfig extends Options {
  path: string;
}

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
    {
      path: '/api/admin/organizations',
      target: configService.get('ADMINPANEL_SERVICE_URL'),
      pathRewrite: { '^/api/admin/organizations': '/organizations' },
      changeOrigin: true,
      logLevel: 'debug',
    },
    {
      path: '/api/admin/businesses',
      target: configService.get('BUSINESSES_SERVICE_URL'),
      pathRewrite: { '^/api/admin/businesses': '/businesses' },
      changeOrigin: true,
      logLevel: 'debug',
    },
  ];
};
