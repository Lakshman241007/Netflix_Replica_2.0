import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { ProfileContext } from '../context/ProfileContext.jsx';
import { Bell, Search, LogOut, User as UserIcon, HelpCircle, ChevronDown, Menu, X, Plus } from 'lucide-react';
import { getNotifications } from '../services/watchlistService.js';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const { activeProfile, selectProfile } = useContext(ProfileContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load notifications
    const loadNotifs = async () => {
      try {
        const res = await getNotifications();
        if (res.success) setNotifications(res.data || []);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };
    if (user) loadNotifs();
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchOpen(false);
    navigate('/');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 px-4 md:px-16 py-4 flex items-center justify-between ${
          isScrolled ? 'bg-[#141414]' : 'bg-transparent bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2" onClick={() => clearSearch()}>
            <span className="text-2xl md:text-3xl font-extrabold text-red-600 tracking-wider">NETFLIX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm text-zinc-300">
            <Link to="/" className={`hover:text-white transition ${isActiveRoute('/') ? 'text-white font-semibold' : ''}`}>Home</Link>
            <Link to="/tv-shows" className={`hover:text-white transition ${isActiveRoute('/tv-shows') ? 'text-white font-semibold' : ''}`}>TV Shows</Link>
            <Link to="/movies" className={`hover:text-white transition ${isActiveRoute('/movies') ? 'text-white font-semibold' : ''}`}>Movies</Link>
            <Link to="/my-list" className={`hover:text-white transition ${isActiveRoute('/my-list') ? 'text-white font-semibold' : ''}`}>My List</Link>
            {user?.role === 'admin' && (
              <span 
                onClick={() => navigate('/admin-dashboard')} 
                className="hover:text-red-500 font-bold transition cursor-pointer text-red-600 uppercase text-xs border border-red-600/30 px-1.5 py-0.5 rounded"
              >
                Admin
              </span>
            )}
          </nav>
        </div>

        {/* Right side options */}
        <div className="flex items-center gap-4 relative">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-black/40 border border-zinc-700 rounded px-2 py-1 transition-all duration-300">
            <button type="submit" className="text-zinc-300 hover:text-white p-1">
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Titles, people, genres..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
                } else {
                  navigate('/');
                }
              }}
              className="bg-transparent border-none outline-none text-xs text-white pl-2 w-28 sm:w-44 placeholder-zinc-500"
            />
            {searchQuery && (
              <button type="button" onClick={() => clearSearch()} className="text-zinc-500 hover:text-white text-xs pl-1">
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className="text-zinc-300 hover:text-white p-1 relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-[9px] font-bold text-white w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-72 bg-black/95 border border-zinc-800 rounded shadow-2xl p-4 z-50 text-xs">
                <h4 className="font-semibold text-sm mb-2 border-b border-zinc-800 pb-2">Recent Notifications</h4>
                {notifications.length === 0 ? (
                  <p className="text-zinc-500 py-4 text-center">No new notifications</p>
                ) : (
                  <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif._id} className="border-b border-zinc-900 pb-2 last:border-b-0">
                        <p className="text-zinc-200 font-medium">{notif.title}</p>
                        <p className="text-zinc-500 text-[10px] mt-0.5">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1 focus:outline-none"
            >
              <img
                src={activeProfile?.avatarUrl || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=avatar'}
                alt="Profile avatar"
                className="w-8 h-8 rounded"
              />
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-black/95 border border-zinc-800 rounded shadow-2xl overflow-hidden py-1 z-50">
                <div className="px-4 py-2 text-xs text-zinc-400 border-b border-zinc-800">
                  Logged in as <p className="font-bold text-white truncate">{user?.name || user?.email}</p>
                </div>
                
                <Link
                  to="/profiles"
                  onClick={() => {
                    selectProfile(null);
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-300 hover:bg-zinc-900 transition hover:text-white"
                >
                  <UserIcon className="w-4 h-4 text-zinc-500" />
                  Manage Profiles
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-300 hover:bg-zinc-900 transition hover:text-white text-left border-t border-zinc-800"
                >
                  <LogOut className="w-4 h-4 text-zinc-500" />
                  Sign out of Netflix
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden text-zinc-300 hover:text-white p-1"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col p-6 animate-fade-in lg:hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <span className="text-2xl font-bold text-red-600 tracking-wider">NETFLIX</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-lg font-medium text-zinc-300 flex-grow justify-center items-center">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition">Home</Link>
            <Link to="/tv-shows" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition">TV Shows</Link>
            <Link to="/movies" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition">Movies</Link>
            <Link to="/my-list" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition">My List</Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin-dashboard" 
                onClick={() => setMobileMenuOpen(false)} 
                className="text-red-500 hover:text-red-400 transition"
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-zinc-500 px-6 py-12 md:px-16 mt-16 max-w-5xl mx-auto w-full text-xs">
        <div className="flex gap-6 mb-6">
          <span className="hover:text-white cursor-pointer transition">Audio Description</span>
          <span className="hover:text-white cursor-pointer transition">Help Center</span>
          <span className="hover:text-white cursor-pointer transition">Gift Cards</span>
          <span className="hover:text-white cursor-pointer transition">Media Center</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="#" className="hover:underline">Investor Relations</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Legal Notices</a>
          <a href="#" className="hover:underline">Cookie Preferences</a>
          <a href="#" className="hover:underline">Corporate Information</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
        <p className="border border-zinc-700/50 hover:text-white hover:border-white px-2 py-1 w-max cursor-pointer transition mb-4 rounded">
          Service Code
        </p>
        <p className="text-[10px] text-zinc-600">© 1997-2026 Netflix, Inc. Replica. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default MainLayout;
