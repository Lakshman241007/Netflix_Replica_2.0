import User from '../models/User.js';
import Subscription, { SUBSCRIPTION_PLANS } from '../models/Subscription.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

function normalizePlanName(plan) {
  if (!plan || typeof plan !== 'string') return null;
  const lower = plan.trim().toLowerCase();
  if (lower === 'basic') return 'Basic';
  if (lower === 'standard') return 'Standard';
  if (lower === 'premium') return 'Premium';
  return null;
}

export const getSubscriptionPlans = async (req, res) => {
  return successResponse(res, Object.values(SUBSCRIPTION_PLANS), 'Available subscription plans');
};

export const getSubscription = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const sub = await Subscription.findOne({ userId });

    if (!sub) {
      return successResponse(
        res,
        {
          userId,
          status: 'inactive',
          plan: 'none',
          price: 0,
          quality: 'Standard Definition',
          screens: 1,
          availablePlans: Object.values(SUBSCRIPTION_PLANS)
        },
        'No active subscription found'
      );
    }

    const planMeta = SUBSCRIPTION_PLANS[sub.plan] || SUBSCRIPTION_PLANS.Standard;

    return successResponse(
      res,
      {
        ...sub,
        features: planMeta,
        availablePlans: Object.values(SUBSCRIPTION_PLANS)
      },
      'Subscription details retrieved successfully'
    );
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const createSubscription = async (req, res) => {
  const { plan } = req.body;
  const normalized = normalizePlanName(plan);

  if (!normalized) {
    return errorResponse(
      res,
      'Valid plan type is required (Basic, Standard, or Premium)',
      400
    );
  }

  try {
    const userId = req.user._id || req.user.id;
    const planMeta = SUBSCRIPTION_PLANS[normalized];
    const existing = await Subscription.findOne({ userId });
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    let sub;
    if (existing) {
      sub = await Subscription.findByIdAndUpdate(existing._id || existing.id, {
        plan: normalized,
        status: 'active',
        price: planMeta.price,
        billingPeriod: planMeta.billingPeriod,
        quality: planMeta.quality,
        resolution: planMeta.resolution,
        screens: planMeta.screens,
        downloads: planMeta.downloads,
        spatialAudio: planMeta.spatialAudio,
        ultraHd: planMeta.ultraHd,
        startDate: existing.startDate || now.toISOString(),
        endDate: expiry.toISOString(),
        expiresAt: expiry.toISOString(),
        updatedAt: now.toISOString()
      });
    } else {
      sub = await Subscription.create({
        userId,
        plan: normalized,
        status: 'active',
        startDate: now.toISOString(),
        endDate: expiry.toISOString(),
        expiresAt: expiry.toISOString()
      });
    }

    await User.findByIdAndUpdate(userId, { subscriptionStatus: 'active' });

    return successResponse(res, sub, 'Subscription activated successfully', 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const updateSubscription = async (req, res) => {
  const { plan } = req.body;
  const normalized = normalizePlanName(plan);

  if (!normalized) {
    return errorResponse(
      res,
      'Valid plan type is required (Basic, Standard, or Premium)',
      400
    );
  }

  try {
    const userId = req.user._id || req.user.id;
    const planMeta = SUBSCRIPTION_PLANS[normalized];
    const existing = await Subscription.findOne({ userId });
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    let sub;
    if (existing) {
      sub = await Subscription.findByIdAndUpdate(existing._id || existing.id, {
        plan: normalized,
        status: 'active',
        price: planMeta.price,
        billingPeriod: planMeta.billingPeriod,
        quality: planMeta.quality,
        resolution: planMeta.resolution,
        screens: planMeta.screens,
        downloads: planMeta.downloads,
        spatialAudio: planMeta.spatialAudio,
        ultraHd: planMeta.ultraHd,
        endDate: expiry.toISOString(),
        expiresAt: expiry.toISOString(),
        updatedAt: now.toISOString()
      });
    } else {
      sub = await Subscription.create({
        userId,
        plan: normalized,
        status: 'active',
        startDate: now.toISOString(),
        endDate: expiry.toISOString(),
        expiresAt: expiry.toISOString()
      });
    }

    await User.findByIdAndUpdate(userId, { subscriptionStatus: 'active' });

    return successResponse(res, sub, 'Subscription plan updated successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const existing = await Subscription.findOne({ userId });

    if (!existing) {
      return errorResponse(res, 'No subscription found to cancel', 404);
    }

    const sub = await Subscription.findOneAndUpdate(
      { userId },
      {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      }
    );

    await User.findByIdAndUpdate(userId, { subscriptionStatus: 'cancelled' });

    return successResponse(res, sub, 'Subscription cancelled successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const reactivateSubscription = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const existing = await Subscription.findOne({ userId });

    if (!existing) {
      return errorResponse(res, 'No existing subscription found. Please choose a plan.', 404);
    }

    const sub = await Subscription.findOneAndUpdate(
      { userId },
      {
        status: 'active',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    await User.findByIdAndUpdate(userId, { subscriptionStatus: 'active' });

    return successResponse(res, sub, 'Subscription reactivated successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};
