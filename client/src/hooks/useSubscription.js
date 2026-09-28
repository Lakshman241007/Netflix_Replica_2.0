import { useState, useEffect, useCallback } from 'react';
import subscriptionService from '../services/subscriptionService.js';
import useAuth from './useAuth.js';

export const useSubscription = () => {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [subRes, plansRes] = await Promise.allSettled([
        subscriptionService.getSubscription(),
        subscriptionService.getPlans()
      ]);

      if (subRes.status === 'fulfilled' && subRes.value?.success) {
        setSubscription(subRes.value.data);
      }
      if (plansRes.status === 'fulfilled' && plansRes.value?.success) {
        setPlans(plansRes.value.data);
      }
    } catch (err) {
      console.error('Error loading subscription:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const selectPlan = async (plan) => {
    try {
      setActionLoading(true);
      setError(null);
      const res = await subscriptionService.updateSubscription(plan);
      if (res.success) {
        setSubscription((prev) => ({
          ...prev,
          ...res.data,
          status: 'active',
          plan: res.data.plan
        }));
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to change subscription plan';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const cancel = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const res = await subscriptionService.cancelSubscription();
      if (res.success) {
        setSubscription((prev) => ({
          ...prev,
          status: 'cancelled',
          ...(res.data || {})
        }));
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to cancel subscription';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  const reactivate = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const res = await subscriptionService.reactivateSubscription();
      if (res.success) {
        setSubscription((prev) => ({
          ...prev,
          status: 'active',
          ...(res.data || {})
        }));
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to reactivate subscription';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    subscription,
    plans,
    loading,
    error,
    actionLoading,
    refreshSubscription: fetchSubscription,
    selectPlan,
    cancelSubscription: cancel,
    reactivateSubscription: reactivate,
    isActive: subscription?.status === 'active',
    currentPlan: subscription?.plan || 'Standard'
  };
};

export default useSubscription;
