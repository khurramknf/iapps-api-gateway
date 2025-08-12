// File: api-gateway/backend/src/proxy/setupProxies.ts
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { proxyConfig } from './proxy.map';

export function setupProxies(app: Express, configService: ConfigService) {
  const proxies = proxyConfig(configService);

  proxies.forEach(({ path, ...rest }) => {
    const target = (rest as any).target as string | undefined;

    if (!target) {
      console.error(`[GATEWAY][PROXY] ❌ Missing "target" for path "${path}". Check .env keys.`);
      return; // don't register a broken proxy
    }

    // helpful boot log
    const rewrite = (rest as any).pathRewrite
      ? JSON.stringify((rest as any).pathRewrite)
      : 'none';
    console.log(`[GATEWAY][PROXY] ➜ ${path} → ${target} (rewrite: ${rewrite})`);

    app.use(
      path,
      createProxyMiddleware({
        ...rest,
        secure: false, // dev-safe; revisit for prod behind TLS
        onProxyReq(proxyReq, req) {
          proxyReq.setHeader('x-forwarded-host', req.headers.host || '');
          proxyReq.setHeader('x-forwarded-proto', 'http');
        },
        onError(err, req, res) {
          console.error(`[GATEWAY][PROXY] ✖ ${req.method} ${req.url} → ${target}`, err?.message);
          res.writeHead(504);
          res.end('Gateway Timeout (proxy error)');
        },
      })
    );
  });
}
