import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-800/60 bg-[#141414] text-zinc-500 text-xs py-10 px-4 sm:px-8 md:px-12 mt-16 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <span className="text-sm font-bold text-zinc-300 tracking-wider">NETFLIX REPLICA V1</span>
          <p className="text-zinc-500 text-[11px] mt-1">
            Complete Full-Stack Media Platform &amp; Interactive Technical Architecture.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-zinc-400">
          <Link to="/" className="hover:text-white transition py-1">Home</Link>
          <Link to="/movies" className="hover:text-white transition py-1">Movies</Link>
          <Link to="/tv" className="hover:text-white transition py-1">TV Shows</Link>
          <Link to="/my-list" className="hover:text-white transition py-1">My List</Link>
          <Link to="/about" className="hover:text-white transition py-1">About Project</Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row justify-between text-[11px] text-zinc-600 gap-2 text-center sm:text-left">
        <p>© 2026 Netflix Replica V1. Built for educational &amp; architectural demonstration.</p>
        <p>REST API &amp; MongoDB Powered Content Pipeline</p>
      </div>
    </footer>
  );
};

export default Footer;
