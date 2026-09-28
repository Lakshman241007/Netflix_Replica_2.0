import * as profileService from '../services/profileService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getProfiles = async (req, res) => {
  const userId = req.user.id || req.user._id;
  try {
    const profiles = await profileService.getProfilesByUser(userId);
    return successResponse(res, profiles, 'Profiles retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

export const getProfileById = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { id } = req.params;

  try {
    const profile = await profileService.getProfileByIdAndUser(id, userId);
    if (!profile) {
      return errorResponse(res, 'Profile not found', 404);
    }
    return successResponse(res, profile, 'Profile retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

export const createProfile = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { name, avatar, avatarUrl, isKids } = req.body;

  try {
    const profile = await profileService.createProfileForUser(userId, {
      name,
      avatar,
      avatarUrl,
      isKids
    });
    return successResponse(res, profile, 'Profile created successfully', 201);
  } catch (err) {
    const isLimit = err.message && err.message.includes('Maximum of 5');
    return errorResponse(res, err.message, isLimit ? 400 : 400);
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { id } = req.params;
  const { name, avatar, avatarUrl, isKids } = req.body;

  try {
    const updated = await profileService.updateProfileForUser(id, userId, {
      name,
      avatar,
      avatarUrl,
      isKids
    });

    if (!updated) {
      return errorResponse(res, 'Profile not found', 404);
    }

    return successResponse(res, updated, 'Profile updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

export const deleteProfile = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { id } = req.params;

  try {
    const result = await profileService.deleteProfileForUser(id, userId);
    if (!result) {
      return errorResponse(res, 'Profile not found', 404);
    }

    return successResponse(res, null, 'Profile deleted successfully');
  } catch (err) {
    const isLast = err.message && err.message.includes('At least one');
    return errorResponse(res, err.message, isLast ? 400 : 500);
  }
};
