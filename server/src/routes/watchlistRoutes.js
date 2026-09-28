import express from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist
} from '../controllers/watchlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getWatchlist);
router.post('/', protect, addToWatchlist);
router.delete('/:movieId', protect, removeFromWatchlist);
router.get('/check/:movieId', protect, checkWatchlist);

// Compatibility route for legacy callers
router.post('/remove', protect, removeFromWatchlist);

export default router;
