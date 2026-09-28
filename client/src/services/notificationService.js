import { request } from './api.js';

export const getNotifications = async () => {
  const response = await request('/notifications');
  return {
    notifications: response.data || [],
    unreadCount: response.unreadCount ?? (response.data || []).filter((n) => !n.read).length
  };
};

export const markAsRead = async (id) => {
  return await request(`/notifications/${id}/read`, {
    method: 'PATCH'
  });
};

export const markAllAsRead = async () => {
  return await request('/notifications/read-all', {
    method: 'PATCH'
  });
};

export const createNotification = async (data) => {
  return await request('/notifications', {
    method: 'POST',
    body: data
  });
};

export const deleteNotification = async (id) => {
  return await request(`/notifications/${id}`, {
    method: 'DELETE'
  });
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification
};
