import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      // Proceed directly to profile selection (Who's watching?)
      navigate('/profiles');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-black/80 p-8 sm:p-12 md:p-14 rounded-lg border border-zinc-800 shadow-2xl backdrop-blur-md select-none">
      <h1 className="text-2xl sm:text-3xl font-black mb-6 text-white">Sign Up</h1>

      {error && (
        <div className="bg-[#e87c03] text-white text-xs py-3 px-4 rounded mb-5 font-medium animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-zinc-800/80 hover:bg-zinc-800 focus:bg-zinc-800 border border-zinc-700/60 focus:border-zinc-500 rounded px-4 py-3 outline-none text-white text-sm transition placeholder-zinc-400"
            required
          />
        </div>

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
            placeholder="Password (minimum 6 characters)"
            className="w-full bg-zinc-800/80 hover:bg-zinc-800 focus:bg-zinc-800 border border-zinc-700/60 focus:border-zinc-500 rounded px-4 py-3 outline-none text-white text-sm transition placeholder-zinc-400"
            required
          />
        </div>

        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full bg-zinc-800/80 hover:bg-zinc-800 focus:bg-zinc-800 border border-zinc-700/60 focus:border-zinc-500 rounded px-4 py-3 outline-none text-white text-sm transition placeholder-zinc-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-600/50 py-3 text-sm font-bold rounded transition mt-2 text-white"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-zinc-400 text-sm mt-8">
        Already have an account?{' '}
        <Link to="/login" className="text-white font-semibold hover:underline">
          Sign in now.
        </Link>
      </p>
    </div>
  );
};

export default Signup;
