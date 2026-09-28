import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Film, Sparkles, PlayCircle, Info, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications.js';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (notification) => {
    const id = notification.id || notification._id;
    if (!notification.read) {
      markAsRead(id);
    }
    setIsOpen(false);

    if (notification.movieId) {
      navigate(`/movies/${notification.movieId}`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_release':
        return <Film className="w-4 h-4 text-red-500" />;
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'continue_watching':
        return <PlayCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 text-zinc-400" />;
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-zinc-300 hover:text-white transition p-1.5 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-600"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-red-600 rounded-full ring-2 ring-zinc-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-[-48px] sm:right-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-96 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-lg shadow-2xl py-2 z-50 animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
                title="Mark all as read"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/50">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs flex flex-col items-center gap-2">
                <Bell className="w-6 h-6 text-zinc-600 opacity-60" />
                <span>No new notifications</span>
              </div>
            ) : (
              notifications.map((n) => {
                const id = n.id || n._id;
                return (
                  <div
                    key={id}
                    onClick={() => handleItemClick(n)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-zinc-800/60 cursor-pointer transition relative group ${
                      !n.read ? 'bg-zinc-800/30' : ''
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {!n.read && (
                      <span className="absolute left-1 top-4 w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}

                    {/* Image / Icon */}
                    {n.imageUrl ? (
                      <img
                        src={n.imageUrl}
                        alt=""
                        className="w-10 h-10 rounded object-cover flex-shrink-0 border border-zinc-700/50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700/50">
                        {getIcon(n.type)}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className={`text-xs font-semibold truncate ${!n.read ? 'text-white' : 'text-zinc-300'}`}>
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-zinc-500 flex-shrink-0">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">
                        {n.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
