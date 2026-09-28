import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification,
  deleteNotification
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);

// Mark read routes
router.patch('/read-all', protect, markAllNotificationsRead);
router.post('/read-all', protect, markAllNotificationsRead);
router.put('/read-all', protect, markAllNotificationsRead);

router.patch('/:id/read', protect, markNotificationRead);
router.put('/:id/read', protect, markNotificationRead);
router.post('/:id/read', protect, markNotificationRead);

// Create & Delete
router.post('/', protect, createNotification);
router.delete('/:id', protect, deleteNotification);

export default router;
