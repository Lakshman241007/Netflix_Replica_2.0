import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/browse" replace />;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-between"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('https://assets.nflxext.com/us/ffe/siteui/vlv3/f841d4c7-10e1-40af-b8b0-f907bb7d1777/02ce30a1-7c9b-4654-be8d-6a56e7920803/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')`
      }}
    >
      <header className="px-8 py-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-red-600 tracking-wider">NETFLIX</span>
          <span className="text-[10px] bg-red-600/20 border border-red-600/40 text-red-500 font-bold px-1.5 py-0.5 rounded uppercase">Replica</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-black/75 text-zinc-500 px-8 py-8 md:px-16 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-sm">
          <p className="mb-4">Questions? Call 1-800-892-0000</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <a href="#" className="hover:underline">FAQ</a>
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
          <p className="mt-8 text-xs text-zinc-600">Netflix Replica © 2026</p>
        </div>
      </footer>
    </div>
  );
};
export default AuthLayout;
