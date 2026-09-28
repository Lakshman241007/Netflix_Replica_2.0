import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useSubscription from '../hooks/useSubscription.js';
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  CreditCard,
  Tv,
  CheckCircle2,
  AlertCircle,
  Users,
  History,
  Bookmark,
  ExternalLink,
  Zap,
  Sparkles,
  Info
} from 'lucide-react';

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const { subscription, loading: subLoading, currentPlan, isActive, cancelSubscription, reactivateSubscription } = useSubscription();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const creationDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Active Member';

  const renewalDate = subscription?.endDate || subscription?.expiresAt
    ? new Date(subscription.endDate || subscription.expiresAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'In 30 days';

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-16 px-4 sm:px-8 md:px-16 animate-fade-in select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight mb-2">
            Account &amp; Settings
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Manage your personal profile, simulated membership, playback preferences, and security.
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 flex items-center justify-between animate-fade-in">
            <span>{feedback}</span>
            <button onClick={() => setFeedback('')} className="text-zinc-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Section 1: Membership & Billing */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-black text-white">Membership &amp; Plan</h2>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {subscription?.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Current Tier: <strong className="text-zinc-200">{currentPlan} Plan</strong> ({subscription?.quality || 'Full HD'})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/subscription"
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 px-5 rounded-lg transition shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Change Plan
              </Link>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between gap-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <CreditCard className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-zinc-300">Simulated Price</span>
              </div>
              <span className="text-lg font-bold text-white">
                ${subscription?.price || (currentPlan === 'Premium' ? '17.99' : currentPlan === 'Basic' ? '8.99' : '13.99')}
                <span className="text-xs text-zinc-500 font-normal"> / month</span>
              </span>
            </div>

            <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between gap-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Tv className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-zinc-300">Streaming Quality</span>
              </div>
              <span className="text-sm font-bold text-white">
                {subscription?.resolution || (currentPlan === 'Premium' ? '4K Ultra HD + HDR' : '1080p Full HD')}
              </span>
            </div>

            <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between gap-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-zinc-300">Next Billing Date</span>
              </div>
              <span className="text-sm font-semibold text-zinc-200">{renewalDate}</span>
            </div>
          </div>
        </div>

        {/* Section 2: User Profile Details */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
              <div className="w-14 h-14 rounded-2xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xl">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>

            {/* Account Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-xl flex items-center gap-3">
                <User className="w-4 h-4 text-zinc-400" />
                <div>
                  <span className="text-zinc-500 block text-[11px]">Display Name</span>
                  <span className="font-semibold text-zinc-200">{user.name}</span>
                </div>
              </div>

              <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-xl flex items-center gap-3">
                <Mail className="w-4 h-4 text-zinc-400" />
                <div>
                  <span className="text-zinc-500 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-zinc-200 truncate">{user.email}</span>
                </div>
              </div>

              <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-xl flex items-center gap-3">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <div>
                  <span className="text-zinc-500 block text-[11px]">Member Since</span>
                  <span className="font-semibold text-zinc-200">{creationDate}</span>
                </div>
              </div>

              <div className="bg-black/40 border border-zinc-800/80 p-4 rounded-xl flex items-center gap-3">
                <Shield className="w-4 h-4 text-zinc-400" />
                <div>
                  <span className="text-zinc-500 block text-[11px]">Account Role</span>
                  <span className="font-semibold text-zinc-200 capitalize">{user.role || 'Member'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Quick Navigation & Activity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/profiles"
            className="bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 p-5 rounded-2xl transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-red-600/20 flex items-center justify-center text-zinc-300 group-hover:text-red-500 transition">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Manage Profiles</h4>
              <p className="text-[11px] text-zinc-400">Switch or edit viewing profiles</p>
            </div>
          </Link>

          <Link
            to="/history"
            className="bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 p-5 rounded-2xl transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-red-600/20 flex items-center justify-center text-zinc-300 group-hover:text-red-500 transition">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Viewing History</h4>
              <p className="text-[11px] text-zinc-400">See all watched titles and progress</p>
            </div>
          </Link>

          <Link
            to="/my-list"
            className="bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 p-5 rounded-2xl transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-red-600/20 flex items-center justify-center text-zinc-300 group-hover:text-red-500 transition">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">My List</h4>
              <p className="text-[11px] text-zinc-400">Saved movies and shows</p>
            </div>
          </Link>
        </div>

        {/* Section 4: Sign Out */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs py-3 px-6 rounded-xl transition"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Sign Out of All Devices
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
