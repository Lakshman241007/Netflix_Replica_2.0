import React from 'react';
import { Edit2 } from 'lucide-react';

export const ProfileCard = ({ profile, onClick, isManaging = false }) => {
  if (!profile) return null;

  const avatarSrc = profile.avatar || profile.avatarUrl;

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => onClick(profile)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(profile);
        }
      }}
      aria-label={`Select profile ${profile.name}`}
      className="group flex flex-col items-center cursor-pointer select-none focus:outline-none"
    >
      {/* Avatar Container */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white group-focus:border-white transition-all duration-200 shadow-lg">
        <img
          src={avatarSrc}
          alt={profile.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Manage Mode Overlay */}
        {isManaging && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="p-2 bg-black/70 rounded-full border border-zinc-400 text-white shadow-md">
              <Edit2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
          </div>
        )}
      </div>

      {/* Name and Kids Badge */}
      <div className="flex flex-col items-center mt-3 gap-1">
        <span className="text-zinc-400 text-sm sm:text-base group-hover:text-white transition-colors duration-200 font-medium">
          {profile.name}
        </span>
        {profile.isKids && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
            Kids
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
