import { request } from './api.js';

export const getRecommendations = async (profileId, limit = 10) => {
  const query = new URLSearchParams();
  if (profileId) query.append('profileId', profileId);
  if (limit) query.append('limit', limit);
  const queryString = query.toString() ? `?${query.toString()}` : '';
  const response = await request(`/recommendations${queryString}`);
  return response.data || [];
};

export default {
  getRecommendations
};
