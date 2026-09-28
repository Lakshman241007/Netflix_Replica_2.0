import express from 'express';
import { handleSearch } from '../controllers/searchController.js';

const router = express.Router();

// GET /api/search?q=<query>
router.get('/', handleSearch);

export default router;
