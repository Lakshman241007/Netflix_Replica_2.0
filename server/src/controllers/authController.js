import { registerUser, authenticateUser } from '../services/authService.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await registerUser(name, email, password);
    return sendTokenResponse(user, 201, res);
  } catch (err) {
    const isDuplicate = err.message && err.message.toLowerCase().includes('already registered');
    const statusCode = isDuplicate ? 409 : 400;
    return errorResponse(res, err.message, statusCode);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    return sendTokenResponse(user, 200, res);
  } catch (err) {
    return errorResponse(res, err.message, 401);
  }
};

export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });

  return successResponse(res, null, 'Logged out successfully');
};

export const getMe = async (req, res) => {
  const safeUser = {
    id: req.user.id || req.user._id,
    _id: req.user.id || req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role || 'user',
    createdAt: req.user.createdAt
  };

  return successResponse(res, safeUser, 'User details retrieved');
};
