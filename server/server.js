import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import app from './src/app.js';
import { PORT } from './src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

async function startServer() {
  if (!isProduction) {
    console.log('Starting full-stack server in DEVELOPMENT mode with Vite Middleware...');
    
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
  } else {
    console.log('Starting full-stack server in PRODUCTION mode...');
    
    const clientDist = path.resolve(__dirname, '../client/dist');
    app.use(express.static(clientDist));
    
    app.get('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.resolve(clientDist, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Netflix Replica Fullstack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
