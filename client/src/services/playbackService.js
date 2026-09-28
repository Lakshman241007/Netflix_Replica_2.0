import { request } from './api.js';

export const getPlayback = async (movieId, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/playback/${movieId}`, { headers });
};

export const createPlayback = async (movieId, data = {}, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/playback/${movieId}`, {
    method: 'POST',
    headers,
    body: data
  });
};

export const updatePlayback = async (movieId, data = {}, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/playback/${movieId}`, {
    method: 'PUT',
    headers,
    body: data
  });
};

export const completePlayback = async (movieId, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/playback/${movieId}/complete`, {
    method: 'POST',
    headers
  });
};

export const deletePlayback = async (movieId, profileId) => {
  const headers = profileId ? { 'x-profile-id': profileId } : {};
  return await request(`/playback/${movieId}`, {
    method: 'DELETE',
    headers
  });
};

// Legacy compatibility aliases
export const getProgress = async (profileId, videoId) => {
  return await getPlayback(videoId, profileId);
};

export const saveProgress = async (profileId, videoId, videoType, progress, duration) => {
  return await updatePlayback(videoId, { position: progress, duration }, profileId);
};

export default {
  getPlayback,
  createPlayback,
  updatePlayback,
  completePlayback,
  deletePlayback,
  getProgress,
  saveProgress
};
