import api from './api.js';

export const subscriptionService = {
  getSubscription: async () => {
    const response = await api.get('/subscription');
    return response.data;
  },

  getPlans: async () => {
    const response = await api.get('/subscription/plans');
    return response.data;
  },

  createSubscription: async (plan) => {
    const response = await api.post('/subscription', { plan });
    return response.data;
  },

  updateSubscription: async (plan) => {
    const response = await api.put('/subscription', { plan });
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await api.delete('/subscription');
    return response.data;
  },

  reactivateSubscription: async () => {
    const response = await api.post('/subscription/reactivate');
    return response.data;
  }
};

export default subscriptionService;
