import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminDist = path.resolve(__dirname, '../admin/dist');
const clientDist = path.resolve(__dirname, '../client/dist');
const targetAdminDistInClient = path.resolve(clientDist, 'admin-app');

try {
  if (fs.existsSync(adminDist) && fs.existsSync(clientDist)) {
    fs.mkdirSync(targetAdminDistInClient, { recursive: true });
    fs.cpSync(adminDist, targetAdminDistInClient, { recursive: true });
    console.log('Successfully bundled admin app into client/dist/admin-app');
  }
} catch (err) {
  console.warn('Notice bundling admin app into client/dist:', err.message);
}
