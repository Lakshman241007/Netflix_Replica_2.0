import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { ProfileProvider } from '../context/ProfileContext.jsx';
import { PlayerProvider } from '../context/PlayerContext.jsx';

import AppLayout from '../layouts/AppLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// Pages
import HomePage from '../pages/Home/HomePage.jsx';
import MoviesPage from '../pages/MoviesPage.jsx';
import MovieDetailsPage from '../pages/MovieDetails/MovieDetailsPage.jsx';
import SearchPage from '../pages/SearchPage.jsx';
import MyListPage from '../pages/MyList/MyListPage.jsx';
import WatchHistory from '../pages/WatchHistory.jsx';
import TVShowsPlaceholder from '../pages/TVShowsPlaceholder.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import AccountPage from '../pages/AccountPage.jsx';
import SubscriptionPage from '../pages/SubscriptionPage.jsx';
import Profiles from '../pages/Profiles.jsx';
import Player from '../pages/Player.jsx';

// Auth Pages
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';

// Preserved for administration
import AdminDashboard from '../pages/AdminDashboard.jsx';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <PlayerProvider>
            <Routes>
              {/* Authenticated Profile Selection Screen */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profiles" element={<Profiles />} />
                <Route path="/who-is-watching" element={<Profiles />} />
                {/* Full-screen Playback Routes */}
                <Route path="/watch/:movieId" element={<Player />} />
                <Route path="/player/:id" element={<Player />} />
              </Route>

              {/* Main Application Layout with Global Header and Footer */}
              <Route element={<AppLayout />}>
                {/* Public Browsing Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/my-list" element={<MyListPage />} />

                {/* Browsing & Category Routes */}
                <Route path="/tv" element={<TVShowsPlaceholder />} />
                <Route path="/tv-shows" element={<TVShowsPlaceholder />} />

                {/* Presentation Route */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/architecture" element={<AboutPage />} />

                {/* Protected Account & History Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/plans" element={<SubscriptionPage />} />
                  <Route path="/history" element={<WatchHistory />} />
                  <Route path="/watch-history" element={<WatchHistory />} />
                </Route>

                {/* Preserved administration route */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Authentication Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Signup />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PlayerProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
