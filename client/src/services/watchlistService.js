import { request } from './api.js';

export const getMyList = async (profileId) => {
  const query = profileId ? `?profileId=${profileId}` : '';
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/watchlist${query}`, { headers });
};

export const addToMyList = async (movieId, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request('/watchlist', {
    method: 'POST',
    headers,
    body: { movieId, profileId }
  });
};

export const removeFromMyList = async (movieId, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/watchlist/${movieId}`, {
    method: 'DELETE',
    headers
  });
};

export const checkMyList = async (movieId, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/watchlist/check/${movieId}`, { headers });
};

export default {
  getMyList,
  addToMyList,
  removeFromMyList,
  checkMyList
};
