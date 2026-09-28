import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import { createProfileForUser } from './profileService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (name, email, password) => {
  if (!name || !name.trim()) {
    throw new Error('Name is required');
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    throw new Error('Please provide a valid email address');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: normalizedEmail.includes('admin') ? 'admin' : 'user',
    subscriptionStatus: 'active'
  });

  // Automatically create default profile for the new user (Phase 4 requirement)
  try {
    await createProfileForUser(newUser._id || newUser.id, {
      name: newUser.name,
      isKids: false
    });
  } catch (err) {
    console.warn('Notice creating default profile:', err.message);
  }

  return newUser;
};

export const authenticateUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Please provide both email and password');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  return {
    id: user._id || user.id,
    _id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'user'
  };
};
