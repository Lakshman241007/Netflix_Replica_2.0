import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Your password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Proceed to profile selection (Who's watching?)
      navigate('/profiles');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@netflix.com');
      setPassword('password123');
    } else {
      setEmail('user@netflix.com');
      setPassword('password123');
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-black/80 p-8 sm:p-12 md:p-14 rounded-lg border border-zinc-800 shadow-2xl backdrop-blur-md">
      <h1 className="text-2xl sm:text-3xl font-black mb-6 text-white">Sign In</h1>

      {error && (
        <div className="bg-[#e87c03] text-white text-xs py-3 px-4 rounded mb-5 font-medium animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full bg-zinc-800/80 hover:bg-zinc-800 focus:bg-zinc-800 border border-zinc-700/60 focus:border-zinc-500 rounded px-4 py-3 outline-none text-white text-sm transition placeholder-zinc-400"
            required
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-zinc-800/80 hover:bg-zinc-800 focus:bg-zinc-800 border border-zinc-700/60 focus:border-zinc-500 rounded px-4 py-3 outline-none text-white text-sm transition placeholder-zinc-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-600/50 py-3 text-sm font-bold rounded transition mt-2 text-white"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="flex items-center justify-between text-zinc-400 text-xs mt-1">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="accent-red-600 rounded" defaultChecked />
            Remember me
          </label>
        </div>
      </form>

      {/* Demo Credentials Helper */}
      <div className="border-t border-zinc-800/80 pt-5 mt-6">
        <p className="text-[11px] text-zinc-400 font-semibold mb-2 uppercase tracking-wider">
          Demo Test Accounts:
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill('user')}
            className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-300 py-1.5 px-3 rounded text-xs hover:bg-zinc-800 hover:text-white transition"
          >
            Demo User
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('admin')}
            className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-300 py-1.5 px-3 rounded text-xs hover:bg-zinc-800 hover:text-white transition"
          >
            Demo Admin
          </button>
        </div>
      </div>

      <p className="text-zinc-400 text-sm mt-8">
        New to Netflix Replica?{' '}
        <Link to="/signup" className="text-white font-semibold hover:underline">
          Sign up now.
        </Link>
      </p>
    </div>
  );
};

export default Login;
