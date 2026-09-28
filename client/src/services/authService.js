import { request } from './api.js';

export const register = async (name, email, password) => {
  const res = await request('/auth/register', {
    method: 'POST',
    body: { name, email, password }
  });
  if (res.data?.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res;
};

export const login = async (email, password) => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: { email, password }
  });
  if (res.data?.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res;
};

export const getCurrentUser = async () => {
  return await request('/auth/me');
};

export const getMe = getCurrentUser;

export const logout = async () => {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error('Logout notice:', err);
  }
  localStorage.removeItem('token');
};
