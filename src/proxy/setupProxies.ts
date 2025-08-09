import { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { proxyConfig } from './proxy.map';

export function setupProxies(app: Express, configService: ConfigService) {
  const proxies = proxyConfig(configService);

  proxies.forEach(({ path, ...rest }) => {
    app.use(path, createProxyMiddleware(rest));
    console.log(`✅ Proxy registered for ${path} → ${rest.target}`);
  });
}
