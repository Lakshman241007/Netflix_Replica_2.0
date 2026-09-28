import express from 'express';
import {
  getHistory,
  getContinueWatching,
  getHistoryItem,
  saveHistory,
  deleteHistoryItem,
  clearHistory
} from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific routes before param routes
router.get('/continue-watching', protect, getContinueWatching);

// Root history operations
router.get('/', protect, getHistory);
router.post('/', protect, saveHistory);
router.delete('/', protect, clearHistory);

// Movie-specific history operations
router.get('/:movieId', protect, getHistoryItem);
router.post('/:movieId', protect, saveHistory);
router.put('/:movieId', protect, saveHistory);
router.delete('/:movieId', protect, deleteHistoryItem);

export default router;
