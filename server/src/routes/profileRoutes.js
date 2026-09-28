import express from 'express';
import {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getProfiles);
router.post('/', protect, createProfile);
router.get('/:id', protect, getProfileById);
router.put('/:id', protect, updateProfile);
router.delete('/:id', protect, deleteProfile);

export default router;
