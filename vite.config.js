import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Mount Vercel serverless handlers (api/*.js) as Vite dev middlewares so `vite dev`
// behaves like prod. One source of truth for /api/* logic.
function vercelDevApi() {
  const routes = [
    { path: '/api/subscribe',         module: './api/subscribe.js' },
    { path: '/api/send-result-email', module: './api/send-result-email.js' },
  ];
  return {
    name: 'vercel-dev-api',
    configureServer(server) {
      for (const { path, module } of routes) {
        server.middlewares.use(path, (req, res) => {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.statusCode = 200;
            return res.end();
          }
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
              // Express/Vercel-style response shims.
              res.status = (code) => { res.statusCode = code; return res; };
              res.json = (obj) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(obj));
                return res;
              };
              const mod = await server.ssrLoadModule(module);
              const handler = mod.default;
              if (typeof handler !== 'function') {
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: `${module} has no default export` }));
              }
              await handler(req, res);
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(`[${path}] dev handler error:`, e);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e?.message || 'Internal error' }));
            }
          });
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), vercelDevApi()],
});
