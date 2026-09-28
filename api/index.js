import app from '../server/src/app.js';
import { dbConnect } from '../server/src/config/db.js';
import { seedDatabase } from '../server/src/seed/seedDatabase.js';

let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    try {
      await dbConnect();
      await seedDatabase();
    } catch (err) {
      console.warn('Vercel serverless initialization notice:', err.message);
    }
    isInitialized = true;
  }
}

export default async function handler(req, res) {
  await ensureInitialized();
  return app(req, res);
}
