import 'dotenv/config';
import express from 'express';
import path from 'path';
import { processFormSubmission } from './api/_mailer.ts';

async function startServer() {
  const app = express();
  const portArgIdx = process.argv.indexOf('--port');
  const cliPort = portArgIdx !== -1 ? Number(process.argv[portArgIdx + 1]) : NaN;
  const envPort = process.env.PORT && process.env.PORT !== '8080' ? Number(process.env.PORT) : NaN;
  const port = (Number.isFinite(cliPort) && cliPort > 0 ? cliPort : undefined) ||
    (Number.isFinite(envPort) && envPort > 0 ? envPort : 3000);

  app.use(express.json({ limit: '6mb' }));

  app.post('/api/send-form', async (req, res) => {
    const result = await processFormSubmission(req.body);
    res.status(result.status).json(result.body);
  });

  app.all('/api/send-form', (_req, res) => {
    res.status(405).json({ ok: false, error: 'Método no permitido.' });
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(import.meta.dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

void startServer();
