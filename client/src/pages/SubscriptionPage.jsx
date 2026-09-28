import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useSubscription from '../hooks/useSubscription.js';
import useAuth from '../hooks/useAuth.js';
import {
  Check,
  ShieldCheck,
  Tv,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Zap
} from 'lucide-react';

const PLAN_DETAILS = [
  {
    name: 'Basic',
    title: 'Basic',
    price: '$8.99',
    period: 'monthly',
    badge: null,
    quality: 'Good (HD)',
    resolution: '720p / 1080p',
    screens: '1 screen at a time',
    downloads: '1 download device',
    audio: 'Standard Stereo',
    hdr: false,
    color: 'from-zinc-800 to-zinc-900',
    borderColor: 'border-zinc-700',
    description: 'A great way to enjoy all your favorite movies and shows in HD.'
  },
  {
    name: 'Standard',
    title: 'Standard',
    price: '$13.99',
    period: 'monthly',
    badge: 'Most Popular',
    quality: 'Great (Full HD)',
    resolution: '1080p (Full HD)',
    screens: '2 screens at a time',
    downloads: '2 download devices',
    audio: 'Enhanced Stereo',
    hdr: false,
    color: 'from-red-950/40 via-zinc-900 to-zinc-900',
    borderColor: 'border-red-600/50',
    description: 'Watch on 2 screens simultaneously with crisp Full HD clarity.'
  },
  {
    name: 'Premium',
    title: 'Premium',
    price: '$17.99',
    period: 'monthly',
    badge: 'Ultra HD 4K + HDR',
    quality: 'Best (4K Ultra HD)',
    resolution: '4K Ultra HD + HDR',
    screens: '4 screens at a time',
    downloads: '6 download devices',
    audio: 'Spatial Audio Included',
    hdr: true,
    color: 'from-amber-950/30 via-zinc-900 to-zinc-900',
    borderColor: 'border-amber-500/50',
    description: 'Our top tier streaming experience with 4K Ultra HD, HDR, and Spatial Audio.'
  }
];

export const SubscriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    subscription,
    loading,
    actionLoading,
    selectPlan,
    cancelSubscription,
    reactivateSubscription
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const currentPlanName = subscription?.plan || 'Standard';
  const isActive = subscription?.status === 'active';
  const isCancelled = subscription?.status === 'cancelled';

  const handlePlanChange = async (planName) => {
    if (actionLoading) return;
    setSuccessMessage('');
    setErrorMessage('');
    setSelectedPlan(planName);

    const result = await selectPlan(planName);
    if (result.success) {
      setSuccessMessage(`Successfully switched to ${planName} Plan! (Simulated)`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(result.message || 'Failed to update plan.');
    }
  };

  const handleConfirmCancel = async () => {
    setShowCancelModal(false);
    setSuccessMessage('');
    setErrorMessage('');
    const result = await cancelSubscription();
    if (result.success) {
      setSuccessMessage('Your membership has been cancelled. (Simulated)');
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(result.message || 'Failed to cancel subscription.');
    }
  };

  const handleReactivate = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    const result = await reactivateSubscription();
    if (result.success) {
      setSuccessMessage('Your membership has been successfully reactivated! (Simulated)');
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(result.message || 'Failed to reactivate subscription.');
    }
  };

  const formattedExpiry = subscription?.endDate || subscription?.expiresAt
    ? new Date(subscription.endDate || subscription.expiresAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '30 days from now';

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-20 px-4 sm:px-8 md:px-12 animate-fade-in select-none">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/80">
          <Link
            to="/account"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs sm:text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulated Demo Environment</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Choose the plan that's right for you
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Upgrade or switch plans at any time. All features are simulated for portfolio and technical demonstration.
          </p>
        </div>

        {/* Notification Toasts */}
        {successMessage && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage('')}
              className="text-emerald-400 hover:text-white text-xs font-semibold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-red-400 hover:text-white text-xs font-semibold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Current Plan Summary Card */}
        {user && (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 mb-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">Current Plan: {currentPlanName}</h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isCancelled
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {subscription?.status || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  {isCancelled
                    ? `Access continues until ${formattedExpiry}`
                    : `Next simulated billing date: ${formattedExpiry}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {isCancelled ? (
                <button
                  onClick={handleReactivate}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-5 rounded-lg transition shadow-lg w-full md:w-auto justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reactivate Membership
                </button>
              ) : (
                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={actionLoading}
                  className="text-xs font-semibold text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/50 py-2.5 px-4 rounded-lg transition w-full md:w-auto"
                >
                  Cancel Membership
                </button>
              )}
            </div>
          </div>
        )}

        {/* Plans Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLAN_DETAILS.map((plan) => {
            const isCurrent = currentPlanName.toLowerCase() === plan.name.toLowerCase() && isActive;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between bg-gradient-to-b ${plan.color} rounded-2xl border ${
                  isCurrent ? 'border-red-500 shadow-2xl shadow-red-950/30 ring-2 ring-red-500/30' : plan.borderColor
                } p-6 sm:p-7 transition-all duration-300 hover:border-zinc-500`}
              >
                {/* Plan Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black tracking-tight text-white">{plan.title}</h3>
                    {isCurrent && (
                      <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold uppercase">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 min-h-[36px] mb-6">{plan.description}</p>

                  <div className="mb-6 pb-6 border-b border-zinc-800">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-zinc-400 text-xs ml-1.5 font-medium">/ month</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 text-xs text-zinc-300 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Video Quality: <strong className="text-zinc-100">{plan.quality}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Resolution: <strong className="text-zinc-100">{plan.resolution}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Simultaneous Streams: <strong className="text-zinc-100">{plan.screens}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Downloads: <strong className="text-zinc-100">{plan.downloads}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Audio: <strong className="text-zinc-100">{plan.audio}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full bg-zinc-800 text-zinc-400 font-bold text-xs py-3 px-4 rounded-xl cursor-default border border-zinc-700/80"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePlanChange(plan.name)}
                      disabled={actionLoading}
                      className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                    >
                      {actionLoading && selectedPlan === plan.name ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Switch to {plan.name}</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Disclaimer */}
        <div className="bg-black/40 border border-zinc-800/80 rounded-2xl p-6 text-xs text-zinc-400 flex items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-zinc-200">Simulation Details</h4>
            <p>
              This is a full-stack mock subscription manager built for Phase 11. No real transactions,
              banking tokens, credit cards, or external payment gateways are invoked. All plan toggles immediately update your profile and playback configuration in memory and MongoDB/local state.
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cancel Membership?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Are you sure you want to cancel your Netflix Replica subscription? You can reactivate anytime without losing your profiles, watch history, or My List.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-xs font-semibold text-zinc-300 hover:text-white px-4 py-2.5 rounded-lg border border-zinc-700 transition"
              >
                Keep Membership
              </button>
              <button
                onClick={handleConfirmCancel}
                className="text-xs font-bold bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg transition shadow-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
