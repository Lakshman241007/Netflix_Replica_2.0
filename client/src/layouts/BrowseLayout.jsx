import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { ProfileContext } from '../context/ProfileContext.jsx';

export const BrowseLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const { activeProfile, loading: profileLoading, fetchProfiles } = useContext(ProfileContext);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there's no active profile and the user is NOT on the profile page, force redirect to profiles selection
  if (!activeProfile && location.pathname !== '/profiles') {
    return <Navigate to="/profiles" replace />;
  }

  // If there IS an active profile and they try to go to `/profiles`, allow it (to manage profiles)
  return <Outlet />;
};
export default BrowseLayout;
