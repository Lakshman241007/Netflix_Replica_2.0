import { request } from './api.js';

export const getWatchHistory = async ({ page = 1, limit = 20 } = {}, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/history?page=${page}&limit=${limit}`, { headers });
};

export const getHistoryItem = async (movieId, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/history/${movieId}`, { headers });
};

export const saveWatchHistory = async (movieId, data = {}, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/history/${movieId}`, {
    method: 'POST',
    headers,
    body: data
  });
};

export const deleteWatchHistoryItem = async (movieId, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/history/${movieId}`, {
    method: 'DELETE',
    headers
  });
};

export const clearWatchHistory = async (profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request('/history', {
    method: 'DELETE',
    headers
  });
};

export const getContinueWatching = async ({ limit = 20 } = {}, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/history/continue-watching?limit=${limit}`, { headers });
};

export default {
  getWatchHistory,
  getHistoryItem,
  saveWatchHistory,
  deleteWatchHistoryItem,
  clearWatchHistory,
  getContinueWatching
};
