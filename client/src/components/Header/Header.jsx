import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LogOut, Users, User as UserIcon, History, Sparkles } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ProfileContext } from '../../context/ProfileContext.jsx';
import { NotificationDropdown } from '../NotificationDropdown/NotificationDropdown.jsx';
import { DEFAULT_AVATAR } from '../../utils/constants.js';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const baseLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'TV Shows', path: '/tv' },
    { label: 'My List', path: '/my-list' },
    { label: 'Search', path: '/search' },
    { label: 'About', path: '/about' }
  ];

  const navLinks = isAuthenticated
    ? [...baseLinks, { label: 'Account', path: '/account' }]
    : baseLinks;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSwitchProfile = () => {
    setDropdownOpen(false);
    navigate('/profiles');
  };

  const profileAvatar = activeProfile?.avatar || activeProfile?.avatarUrl || DEFAULT_AVATAR;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 px-4 md:px-12 py-3.5 flex items-center justify-between ${
        isScrolled
          ? 'bg-[#141414]/95 backdrop-blur-sm shadow-md'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      {/* Brand Logo & Desktop Nav Links */}
      <div className="flex items-center gap-8 md:gap-10">
        <Link to="/" className="flex items-center select-none" aria-label="Netflix Replica Home">
          <span className="text-2xl md:text-3xl font-black text-red-600 tracking-wider">
            NETFLIX
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors duration-200 hover:text-white ${
                isActive(link.path)
                  ? 'text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right side options */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/search"
          className="text-zinc-300 hover:text-white transition p-1.5 rounded-full hover:bg-white/10"
          aria-label="Search"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </Link>

        {isAuthenticated && <NotificationDropdown />}

        {isAuthenticated && user ? (
          /* Active Profile Selector & Menu */
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1.5 rounded border border-zinc-700/80 transition"
              aria-label="Active Profile Menu"
            >
              {activeProfile ? (
                <>
                  <img
                    src={profileAvatar}
                    alt={activeProfile.name}
                    className="w-5 h-5 rounded object-cover"
                  />
                  <span className="max-w-[100px] truncate">{activeProfile.name}</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 text-red-500" />
                  <span>Who&apos;s Watching?</span>
                </>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded shadow-2xl py-1 text-xs z-50 animate-scale-up">
                <button
                  onClick={handleSwitchProfile}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                >
                  <Users className="w-3.5 h-3.5 text-red-500" />
                  Switch Profile
                </button>
                <Link
                  to="/history"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                >
                  <History className="w-3.5 h-3.5 text-zinc-400" />
                  Watch History
                </Link>
                <Link
                  to="/subscription"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  Subscription &amp; Plans
                </Link>
                <Link
                  to="/account"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                >
                  <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                  Account Settings
                </Link>
                <div className="border-t border-zinc-800 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out of Netflix
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Logged Out State: Login CTA */
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-1.5 rounded transition shadow"
          >
            Login
          </Link>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-300 hover:text-white p-1.5 focus:outline-none focus:ring-2 focus:ring-red-600 rounded"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[58px] bg-black/95 backdrop-blur-md z-40 flex flex-col p-5 md:hidden animate-fade-in border-t border-zinc-800/80 overflow-y-auto max-h-[calc(100vh-58px)]">
          <nav className="flex flex-col gap-2 text-base font-medium mt-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3.5 rounded-lg transition min-h-[44px] flex items-center ${
                  isActive(link.path)
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-zinc-800/80 mt-2 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/profiles"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3.5 text-zinc-300 flex items-center gap-2.5 rounded-lg hover:bg-zinc-900 min-h-[44px]"
                  >
                    <Users className="w-4 h-4 text-red-500" /> Switch Profile
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3.5 text-zinc-300 flex items-center gap-2.5 rounded-lg hover:bg-zinc-900 min-h-[44px]"
                  >
                    <History className="w-4 h-4 text-zinc-400" /> Watch History
                  </Link>
                  <Link
                    to="/subscription"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3.5 text-zinc-300 flex items-center gap-2.5 rounded-lg hover:bg-zinc-900 min-h-[44px]"
                  >
                    <Sparkles className="w-4 h-4 text-red-500" /> Subscription &amp; Plans
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left py-2.5 px-3.5 text-red-500 font-semibold flex items-center gap-2.5 rounded-lg hover:bg-zinc-900 min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold text-white text-sm min-h-[44px]"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
