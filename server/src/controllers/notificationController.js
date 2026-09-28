import Notification from '../models/Notification.js';
import Profile from '../models/Profile.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const resolveProfileId = (req) => {
  return (
    req.headers['x-profile-id'] ||
    req.query.profileId ||
    (req.body && req.body.profileId) ||
    null
  );
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const profileId = resolveProfileId(req);

    const allNotifications = await Notification.find();

    // Filter relevant notifications (global, for this user, or for this profile)
    const userNotifications = allNotifications.filter((n) => {
      if (!n.userId && !n.profileId) return true; // Global broadcast
      if (userId && String(n.userId) === String(userId)) return true;
      if (profileId && String(n.profileId) === String(profileId)) return true;
      return false;
    });

    // Map each notification with personalized read status
    const formatted = userNotifications.map((n) => {
      const id = n._id || n.id;
      const isReadByArray = Array.isArray(n.readBy) && (
        (userId && n.readBy.includes(String(userId))) ||
        (profileId && n.readBy.includes(String(profileId)))
      );
      const isRead = Boolean(n.read || isReadByArray);

      return {
        id,
        _id: id,
        title: n.title,
        message: n.message,
        type: n.type || 'system',
        movieId: n.movieId || null,
        imageUrl: n.imageUrl || '',
        read: isRead,
        createdAt: n.createdAt || new Date().toISOString()
      };
    });

    // Sort by createdAt descending
    formatted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = formatted.filter((n) => !n.read).length;

    return res.status(200).json({
      success: true,
      data: formatted,
      unreadCount,
      message: 'Notifications retrieved successfully'
    });
  } catch (err) {
    return errorResponse(res, err.message || 'Error fetching notifications', 500);
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = String(req.user?.id || req.user?._id || '');
    const profileId = resolveProfileId(req);

    const notification = await Notification.findById(id) || await Notification.findOne({ _id: id });
    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    const currentReadBy = Array.isArray(notification.readBy) ? [...notification.readBy] : [];
    if (userId && !currentReadBy.includes(userId)) {
      currentReadBy.push(userId);
    }
    if (profileId && !currentReadBy.includes(String(profileId))) {
      currentReadBy.push(String(profileId));
    }

    const isDirectRecipient = notification.userId && String(notification.userId) === userId;

    await Notification.findByIdAndUpdate(notification._id || notification.id, {
      read: isDirectRecipient ? true : notification.read,
      readBy: currentReadBy
    });

    return successResponse(res, { id, read: true }, 'Notification marked as read');
  } catch (err) {
    return errorResponse(res, err.message || 'Error updating notification', 500);
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = String(req.user?.id || req.user?._id || '');
    const profileId = resolveProfileId(req);

    const all = await Notification.find();
    for (const item of all) {
      const currentReadBy = Array.isArray(item.readBy) ? [...item.readBy] : [];
      if (userId && !currentReadBy.includes(userId)) {
        currentReadBy.push(userId);
      }
      if (profileId && !currentReadBy.includes(String(profileId))) {
        currentReadBy.push(String(profileId));
      }
      const isDirect = item.userId && String(item.userId) === userId;
      await Notification.findByIdAndUpdate(item._id || item.id, {
        read: isDirect ? true : item.read,
        readBy: currentReadBy
      });
    }

    return successResponse(res, null, 'All notifications marked as read');
  } catch (err) {
    return errorResponse(res, err.message || 'Error marking all notifications as read', 500);
  }
};

export const createNotification = async (req, res) => {
  try {
    const { title, message, type, movieId, imageUrl, userId, profileId } = req.body;
    if (!title || !message) {
      return errorResponse(res, 'Title and message are required', 400);
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || 'system',
      movieId: movieId || null,
      imageUrl: imageUrl || '',
      userId: userId || null,
      profileId: profileId || null,
      read: false,
      readBy: []
    });

    return successResponse(res, notification, 'Notification created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message || 'Error creating notification', 400);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.deleteOne({ _id: id });
    return successResponse(res, null, 'Notification deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message || 'Error deleting notification', 500);
  }
};
