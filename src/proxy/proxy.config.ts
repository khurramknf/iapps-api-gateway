// services/api-gateway/backend/src/proxy/proxy.config.ts
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';

interface ProxyConfig extends Options {
  path: string;
}

export const createProxyConfig = (configService: ConfigService): ProxyConfig[] => {
  const authServiceUrl = configService.get('AUTH_SERVICE_URL');
  const usersServiceUrl = configService.get('USERS_SERVICE_URL');

  return [
    {
      path: '/api/auth',
      target: authServiceUrl,
      pathRewrite: { '^/api/auth': '' },
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
    },
    {
      path: '/api/users',
      target: usersServiceUrl,
      pathRewrite: { '^/api/users': '' },
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
    },
  ];
}; 