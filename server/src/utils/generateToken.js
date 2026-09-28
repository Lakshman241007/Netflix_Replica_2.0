import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from '../config/env.js';

export const generateToken = (userId) => {
  return jwt.sign(
    { userId: String(userId) },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const sendTokenResponse = (user, statusCode, res) => {
  const userId = user._id || user.id;
  const token = generateToken(userId);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax'
  };

  const safeUser = {
    id: userId,
    _id: userId,
    name: user.name,
    email: user.email,
    role: user.role || 'user'
  };

  return res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      data: {
        user: safeUser,
        token
      }
    });
};
