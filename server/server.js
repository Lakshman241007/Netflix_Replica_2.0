import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import app from './src/app.js';
import { PORT } from './src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const candidateClientDistPaths = [
    path.resolve(__dirname, '../client/dist'),
    path.resolve(process.cwd(), 'client/dist'),
    path.resolve(__dirname, './dist'),
    path.resolve(process.cwd(), 'dist')
  ];

  const clientDist = candidateClientDistPaths.find(dir => fs.existsSync(path.resolve(dir, 'index.html')));

  if (clientDist) {
    const clientIndex = path.resolve(clientDist, 'index.html');
    console.log('Serving production static build from:', clientDist);

    // Serve static client assets
    app.use(express.static(clientDist));

    // Support admin build if available
    const candidateAdminDistPaths = [
      path.resolve(__dirname, '../admin/dist'),
      path.resolve(process.cwd(), 'admin/dist')
    ];
    const adminDist = candidateAdminDistPaths.find(dir => fs.existsSync(path.resolve(dir, 'index.html')));
    if (adminDist) {
      app.use('/admin-app', express.static(adminDist));
    }

    // SPA catch-all fallback for client router (excludes API routes)
    app.get('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      res.sendFile(clientIndex);
    });
  } else {
    console.log('Starting full-stack server with Vite middleware...');

    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          host: '0.0.0.0',
          allowedHosts: 'all'
        },
        appType: 'custom',
        root: path.resolve(__dirname, '../client')
      });

      // Bypass Vite middleware for all /api endpoints
      app.use((req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
          return next();
        }
        vite.middlewares(req, res, next);
      });

      // Serve HTML entry with Vite transform
      app.use('*', async (req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
          return next();
        }
        try {
          const indexPath = path.resolve(__dirname, '../client/index.html');
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (err) {
          vite.ssrFixStacktrace(err);
          next(err);
        }
      });
    } catch (err) {
      console.warn('Vite development server not available. Running API-only fallback:', err.message);
      app.get('*', (req, res) => {
        if (req.originalUrl.startsWith('/api')) {
          return res.status(404).json({ success: false, message: 'API endpoint not found' });
        }
        res.status(503).send('Frontend build not ready. Please run npm run build.');
      });
    }
  }

  const serverPort = Number(process.env.PORT) || Number(PORT) || 3000;
  app.listen(serverPort, '0.0.0.0', () => {
    console.log(`Netflix Replica Fullstack server running at http://0.0.0.0:${serverPort}`);
  });
}

startServer();

