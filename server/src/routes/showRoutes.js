import express from 'express';
import { getShows, getShowById, createShow, updateShow, deleteShow } from '../controllers/showController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', protect, getShows);
router.get('/:id', protect, getShowById);
router.post('/', protect, adminOnly, createShow);
router.put('/:id', protect, adminOnly, updateShow);
router.delete('/:id', protect, adminOnly, deleteShow);

export default router;
