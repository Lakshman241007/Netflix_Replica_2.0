export const ALLOWED_AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=red',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=blue',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=green',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=yellow',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=purple',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=kids'
];

export const DEFAULT_AVATAR = ALLOWED_AVATARS[0];
export const KIDS_AVATAR = ALLOWED_AVATARS[5];

export const isValidAvatar = (avatar) => {
  if (!avatar) return false;
  return ALLOWED_AVATARS.includes(avatar);
};
