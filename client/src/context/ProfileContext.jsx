import React, { createContext, useState, useEffect, useContext } from 'react';
import * as profileService from '../services/profileService.js';
import { AuthContext } from './AuthContext.jsx';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    if (!isAuthenticated && !user) {
      setProfiles([]);
      setActiveProfile(null);
      return [];
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await profileService.getProfiles();
      const list = res.data || [];
      setProfiles(list);

      // Validate and restore active profile from localStorage (Step 16 & 17)
      const storedProfileId = localStorage.getItem('activeProfileId');
      if (storedProfileId && list.length > 0) {
        const found = list.find((p) => (p._id || p.id) === storedProfileId);
        if (found) {
          setActiveProfile(found);
        } else {
          // Stored profile does not belong to this account
          localStorage.removeItem('activeProfileId');
          setActiveProfile(null);
        }
      } else if (list.length === 0) {
        setActiveProfile(null);
      }
      return list;
    } catch (err) {
      console.warn('Notice loading profiles:', err.message);
      setError('Unable to load profiles.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfiles();
    } else {
      setProfiles([]);
      setActiveProfile(null);
      localStorage.removeItem('activeProfileId');
    }
  }, [isAuthenticated, user?.id]);

  const selectProfile = (profile) => {
    setActiveProfile(profile);
    if (profile) {
      localStorage.setItem('activeProfileId', profile._id || profile.id);
    } else {
      localStorage.removeItem('activeProfileId');
    }
  };

  const createProfile = async (profileData) => {
    try {
      const res = await profileService.createProfile(profileData);
      if (res.success && res.data) {
        const updatedList = await fetchProfiles();
        return res.data;
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      throw err;
    }
  };

  const updateProfile = async (id, profileData) => {
    try {
      const res = await profileService.updateProfile(id, profileData);
      if (res.success && res.data) {
        await fetchProfiles();
        if (activeProfile && (activeProfile._id || activeProfile.id) === id) {
          setActiveProfile(res.data);
        }
        return res.data;
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const deleteProfile = async (id) => {
    try {
      const res = await profileService.deleteProfile(id);
      if (res.success) {
        if (activeProfile && (activeProfile._id || activeProfile.id) === id) {
          setActiveProfile(null);
          localStorage.removeItem('activeProfileId');
        }
        await fetchProfiles();
        return true;
      }
    } catch (err) {
      console.error('Error deleting profile:', err);
      throw err;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        isLoading,
        loading: isLoading, // backwards-compatibility alias
        error,
        selectProfile,
        createProfile,
        createNewProfile: createProfile, // alias
        updateProfile,
        editProfile: updateProfile, // alias
        deleteProfile,
        removeProfile: deleteProfile, // alias
        refreshProfiles: fetchProfiles,
        fetchProfiles
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
