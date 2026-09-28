import { request } from './api.js';

export const getProfiles = async () => {
  return await request('/profiles');
};

export const getProfile = async (id) => {
  return await request(`/profiles/${id}`);
};

export const createProfile = async (profileData) => {
  return await request('/profiles', {
    method: 'POST',
    body: profileData
  });
};

export const updateProfile = async (id, profileData) => {
  return await request(`/profiles/${id}`, {
    method: 'PUT',
    body: profileData
  });
};

export const deleteProfile = async (id) => {
  return await request(`/profiles/${id}`, {
    method: 'DELETE'
  });
};
