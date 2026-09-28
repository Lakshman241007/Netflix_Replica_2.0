import express from 'express';
import {
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
  getSubscriptionPlans
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/plans', getSubscriptionPlans);
router.get('/', protect, getSubscription);
router.post('/', protect, createSubscription);
router.put('/', protect, updateSubscription);
router.delete('/', protect, cancelSubscription);
router.post('/cancel', protect, cancelSubscription);
router.post('/reactivate', protect, reactivateSubscription);

export default router;
