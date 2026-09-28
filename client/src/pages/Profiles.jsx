import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext.jsx';
import ProfileCard from '../components/ProfileCard/ProfileCard.jsx';
import { Plus, X, Trash2, AlertCircle, RotateCcw } from 'lucide-react';
import { AVATARS, DEFAULT_AVATAR, KIDS_AVATAR } from '../utils/constants.js';

export const Profiles = () => {
  const {
    profiles,
    activeProfile,
    isLoading,
    error,
    refreshProfiles,
    selectProfile,
    createProfile,
    updateProfile,
    deleteProfile
  } = useContext(ProfileContext);

  const [isManaging, setIsManaging] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEditProfile, setSelectedEditProfile] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [isKids, setIsKids] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    refreshProfiles();
  }, []);

  const handleProfileClick = (profile) => {
    if (isManaging) {
      setSelectedEditProfile(profile);
      setName(profile.name);
      setAvatar(profile.avatar || profile.avatarUrl || DEFAULT_AVATAR);
      setIsKids(!!profile.isKids);
      setFormError('');
      setShowEditModal(true);
    } else {
      selectProfile(profile);
      navigate('/');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter a profile name.');
      return;
    }

    if (name.trim().length > 30) {
      setFormError('Profile name cannot exceed 30 characters.');
      return;
    }

    setActionLoading(true);
    try {
      const created = await createProfile({
        name: name.trim(),
        avatar: isKids && avatar === DEFAULT_AVATAR ? KIDS_AVATAR : avatar,
        isKids
      });
      setShowAddModal(false);
      resetForm();
      if (!isManaging && created) {
        selectProfile(created);
        navigate('/');
      }
    } catch (err) {
      setFormError(err.message || 'Error creating profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter a profile name.');
      return;
    }

    setActionLoading(true);
    try {
      await updateProfile(selectedEditProfile._id || selectedEditProfile.id, {
        name: name.trim(),
        avatar,
        isKids
      });
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      setFormError(err.message || 'Error updating profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (profileId) => {
    if (profiles.length <= 1) {
      setFormError('At least one profile is required.');
      return;
    }

    setActionLoading(true);
    try {
      await deleteProfile(profileId);
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      setFormError(err.message || 'Error deleting profile');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setAvatar(DEFAULT_AVATAR);
    setIsKids(false);
    setFormError('');
    setSelectedEditProfile(null);
  };

  if (isLoading && profiles.length === 0) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-center items-center px-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-400 text-sm">Loading profiles...</p>
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-center items-center px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mb-3" />
        <h2 className="text-xl font-bold mb-2">Unable to load profiles</h2>
        <p className="text-zinc-400 text-sm mb-6 max-w-sm">{error}</p>
        <button
          onClick={refreshProfiles}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs py-2.5 px-5 rounded transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-center items-center px-4 py-16 select-none animate-fade-in">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide mb-10 text-center text-zinc-100">
        {isManaging ? 'Manage Profiles:' : "Who's watching?"}
      </h1>

      {/* Profiles Grid */}
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 max-w-4xl mb-12">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile._id || profile.id}
            profile={profile}
            onClick={handleProfileClick}
            isManaging={isManaging}
          />
        ))}

        {/* Add Profile Tile (Maximum 5 profiles) */}
        {profiles.length < 5 && (
          <div
            tabIndex={0}
            role="button"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                resetForm();
                setShowAddModal(true);
              }
            }}
            aria-label="Add Profile"
            className="group flex flex-col items-center cursor-pointer select-none focus:outline-none"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-md flex items-center justify-center border-2 border-dashed border-zinc-700 bg-zinc-900/60 group-hover:border-zinc-300 group-hover:bg-zinc-800 transition-all duration-200">
              <Plus className="w-12 h-12 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
            </div>
            <span className="text-zinc-400 group-hover:text-white transition-colors mt-3 text-sm sm:text-base font-medium">
              Add Profile
            </span>
          </div>
        )}
      </div>

      {/* Manage Profiles Toggle Button */}
      <button
        onClick={() => setIsManaging(!isManaging)}
        className="border border-zinc-500 hover:border-zinc-200 hover:text-white text-zinc-400 font-semibold px-6 py-2 tracking-widest text-xs uppercase transition duration-200"
      >
        {isManaging ? 'Done' : 'Manage Profiles'}
      </button>

      {/* --- ADD PROFILE MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold">Add Profile</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white transition p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-[#e87c03] text-white text-xs py-2.5 px-3.5 rounded mb-4 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-5">
              {/* Avatar Selector */}
              <div>
                <label className="text-xs text-zinc-400 block mb-2 font-medium">Choose Avatar</label>
                <div className="flex gap-2.5 overflow-x-auto pb-2">
                  {AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-12 h-12 rounded-md border-2 overflow-hidden flex-shrink-0 transition-all ${
                        avatar === av ? 'border-red-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Profile Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 text-white rounded px-4 py-2.5 outline-none text-sm placeholder-zinc-500 border border-zinc-700 focus:border-zinc-400 transition"
                  maxLength={30}
                  required
                />
              </div>

              {/* Kids Mode Toggle */}
              <label className="flex items-center justify-between bg-zinc-800/40 p-3.5 rounded border border-zinc-800 cursor-pointer">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Kids Profile?</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Appropriate for children 12 and under</p>
                </div>
                <input
                  type="checkbox"
                  checked={isKids}
                  onChange={(e) => setIsKids(e.target.checked)}
                  className="w-5 h-5 accent-red-600 cursor-pointer rounded"
                />
              </label>

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="border border-zinc-600 hover:border-zinc-400 text-zinc-300 font-semibold text-xs uppercase py-2.5 px-4 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase py-2.5 px-5 rounded transition disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PROFILE MODAL --- */}
      {showEditModal && selectedEditProfile && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-zinc-400 hover:text-white transition p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-[#e87c03] text-white text-xs py-2.5 px-3.5 rounded mb-4 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
              {/* Avatar Selector */}
              <div>
                <label className="text-xs text-zinc-400 block mb-2 font-medium">Choose Avatar</label>
                <div className="flex gap-2.5 overflow-x-auto pb-2">
                  {AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-12 h-12 rounded-md border-2 overflow-hidden flex-shrink-0 transition-all ${
                        avatar === av ? 'border-red-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Profile Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 text-white rounded px-4 py-2.5 outline-none text-sm placeholder-zinc-500 border border-zinc-700 focus:border-zinc-400 transition"
                  maxLength={30}
                  required
                />
              </div>

              {/* Kids Mode Toggle */}
              <label className="flex items-center justify-between bg-zinc-800/40 p-3.5 rounded border border-zinc-800 cursor-pointer">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Kids Profile?</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Appropriate for children 12 and under</p>
                </div>
                <input
                  type="checkbox"
                  checked={isKids}
                  onChange={(e) => setIsKids(e.target.checked)}
                  className="w-5 h-5 accent-red-600 cursor-pointer rounded"
                />
              </label>

              {/* Delete Profile button (disabled if only 1 profile remains) */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedEditProfile._id || selectedEditProfile.id)}
                  disabled={profiles.length <= 1 || actionLoading}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 transition disabled:opacity-40 disabled:hover:text-zinc-400"
                  title={profiles.length <= 1 ? 'At least one profile is required.' : 'Delete Profile'}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Profile</span>
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="border border-zinc-600 hover:border-zinc-400 text-zinc-300 font-semibold text-xs uppercase py-2.5 px-4 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase py-2.5 px-5 rounded transition disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profiles;
