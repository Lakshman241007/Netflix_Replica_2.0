import Profile from '../models/Profile.js';
import { ALLOWED_AVATARS, DEFAULT_AVATAR, KIDS_AVATAR, isValidAvatar } from '../config/avatars.js';

export const MAX_PROFILES_PER_ACCOUNT = 5;

export const getProfilesByUser = async (userId) => {
  const list = await Profile.find({ userId });
  return list.map((p) => ({
    id: p._id || p.id,
    _id: p._id || p.id,
    name: p.name,
    avatar: p.avatar || p.avatarUrl || DEFAULT_AVATAR,
    avatarUrl: p.avatar || p.avatarUrl || DEFAULT_AVATAR,
    isKids: !!p.isKids,
    createdAt: p.createdAt
  }));
};

export const getProfileByIdAndUser = async (profileId, userId) => {
  const p = await Profile.findOne({ _id: profileId, userId });
  if (!p) return null;

  return {
    id: p._id || p.id,
    _id: p._id || p.id,
    name: p.name,
    avatar: p.avatar || p.avatarUrl || DEFAULT_AVATAR,
    avatarUrl: p.avatar || p.avatarUrl || DEFAULT_AVATAR,
    isKids: !!p.isKids,
    createdAt: p.createdAt
  };
};

export const createProfileForUser = async (userId, { name, avatar, avatarUrl, isKids }) => {
  if (!name || !name.trim()) {
    throw new Error('Please provide a profile name');
  }

  const trimmedName = name.trim();
  if (trimmedName.length > 30) {
    throw new Error('Profile name cannot exceed 30 characters');
  }

  const existingCount = await Profile.countDocuments({ userId });
  if (existingCount >= MAX_PROFILES_PER_ACCOUNT) {
    throw new Error('Maximum of 5 profiles allowed per account');
  }

  const chosenAvatar = avatar || avatarUrl;
  let finalAvatar = DEFAULT_AVATAR;

  if (isKids && !chosenAvatar) {
    finalAvatar = KIDS_AVATAR;
  } else if (chosenAvatar && isValidAvatar(chosenAvatar)) {
    finalAvatar = chosenAvatar;
  } else if (chosenAvatar) {
    // If avatar is provided but not in exact list, pick first or kids
    finalAvatar = isKids ? KIDS_AVATAR : DEFAULT_AVATAR;
  }

  const newProfile = await Profile.create({
    userId,
    name: trimmedName,
    avatar: finalAvatar,
    avatarUrl: finalAvatar,
    isKids: !!isKids
  });

  return {
    id: newProfile._id || newProfile.id,
    _id: newProfile._id || newProfile.id,
    name: newProfile.name,
    avatar: newProfile.avatar,
    avatarUrl: newProfile.avatarUrl,
    isKids: newProfile.isKids,
    createdAt: newProfile.createdAt
  };
};

export const updateProfileForUser = async (profileId, userId, { name, avatar, avatarUrl, isKids }) => {
  const existing = await Profile.findOne({ _id: profileId, userId });
  if (!existing) {
    return null;
  }

  const updateData = {};
  if (name !== undefined && name.trim()) {
    if (name.trim().length > 30) {
      throw new Error('Profile name cannot exceed 30 characters');
    }
    updateData.name = name.trim();
  }

  if (avatar !== undefined || avatarUrl !== undefined) {
    const candidate = avatar || avatarUrl;
    if (isValidAvatar(candidate)) {
      updateData.avatar = candidate;
      updateData.avatarUrl = candidate;
    }
  }

  if (isKids !== undefined) {
    updateData.isKids = !!isKids;
  }

  const updated = await Profile.findByIdAndUpdate(profileId, updateData);
  return {
    id: updated._id || updated.id,
    _id: updated._id || updated.id,
    name: updated.name,
    avatar: updated.avatar || updated.avatarUrl,
    avatarUrl: updated.avatar || updated.avatarUrl,
    isKids: updated.isKids,
    createdAt: updated.createdAt
  };
};

export const deleteProfileForUser = async (profileId, userId) => {
  const existing = await Profile.findOne({ _id: profileId, userId });
  if (!existing) {
    return null;
  }

  const userProfilesCount = await Profile.countDocuments({ userId });
  if (userProfilesCount <= 1) {
    throw new Error('At least one profile is required.');
  }

  await Profile.deleteOne({ _id: profileId });
  return true;
};
