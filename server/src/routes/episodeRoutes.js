import express from 'express';
import { getEpisodes, getEpisodeById, createEpisode, updateEpisode, deleteEpisode } from '../controllers/episodeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', protect, getEpisodes);
router.get('/:id', protect, getEpisodeById);
router.post('/', protect, adminOnly, createEpisode);
router.put('/:id', protect, adminOnly, updateEpisode);
router.delete('/:id', protect, adminOnly, deleteEpisode);

export default router;
