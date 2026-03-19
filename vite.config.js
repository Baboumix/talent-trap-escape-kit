import 'dotenv/config'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'brevo-api',
      configureServer(server) {
        server.middlewares.use('/api/subscribe', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end('Method not allowed');
            return;
          }
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body);
              const response = await fetch('https://api.brevo.com/v3/contacts', {
                method: 'POST',
                headers: {
                  'accept': 'application/json',
                  'content-type': 'application/json',
                  'api-key': process.env.BREVO_API_KEY,
                },
                body: JSON.stringify({
                  email: data.email,
                  listIds: [2],
                  attributes: {
                    PROFILE: data.profile,
                    SCORE: data.score,
                    VERDICT: data.verdict,
                    LANG: data.lang,
                  },
                  updateEnabled: true,
                }),
              });
              const result = await response.json();
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = response.ok ? 200 : 400;
              res.end(JSON.stringify(result));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        });
      },
    },
  ],
})
