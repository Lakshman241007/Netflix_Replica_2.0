import express from 'express';
import {
  getPlayback,
  getContinueWatching,
  initOrUpdatePlayback,
  markPlaybackComplete,
  deletePlayback
} from '../controllers/playbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific routes before parameterized routes
router.get('/continue-watching', protect, getContinueWatching);

// Primary Phase 7 endpoints
router.get('/:movieId', protect, getPlayback);
router.post('/:movieId', protect, initOrUpdatePlayback);
router.put('/:movieId', protect, initOrUpdatePlayback);
router.post('/:movieId/complete', protect, markPlaybackComplete);
router.delete('/:movieId', protect, deletePlayback);

// Legacy query-based endpoints for compatibility
router.get('/', protect, getPlayback);
router.post('/', protect, initOrUpdatePlayback);

export default router;
