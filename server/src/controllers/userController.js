import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    // Strip passwords
    const safeUsers = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      subscriptionStatus: u.subscriptionStatus
    }));
    return successResponse(res, safeUsers, 'Users list retrieved');
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(req.user._id, {
      name: name || req.user.name,
      email: email || req.user.email
    });
    return successResponse(res, {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      subscriptionStatus: updated.subscriptionStatus
    }, 'User updated successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};
