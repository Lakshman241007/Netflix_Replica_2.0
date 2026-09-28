import React from 'react';
import { BookOpen, Layers, Database, Cpu, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPlaceholder = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center select-none pt-24 pb-16">
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-8 max-w-xl shadow-2xl flex flex-col items-center">
        <div className="p-4 rounded-full bg-red-600/10 border border-red-600/30 text-red-600 mb-4">
          <BookOpen className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Technical Architecture</h1>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          The interactive technical presentation will detail every layer of this full-stack media platform, including technology selection rationales, request lifecycles, and database engineering.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full text-left text-xs mb-6">
          <div className="bg-black/40 border border-zinc-800 p-3 rounded flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-zinc-300 font-medium">REST API Architecture</span>
          </div>
          <div className="bg-black/40 border border-zinc-800 p-3 rounded flex items-center gap-2.5">
            <Database className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-zinc-300 font-medium">MongoDB Content Schema</span>
          </div>
          <div className="bg-black/40 border border-zinc-800 p-3 rounded flex items-center gap-2.5">
            <Film className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-zinc-300 font-medium">Streaming Pipeline</span>
          </div>
          <div className="bg-black/40 border border-zinc-800 p-3 rounded flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-zinc-300 font-medium">React State Management</span>
          </div>
        </div>

        <Link
          to="/"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-6 rounded transition"
        >
          Return to Browsing
        </Link>
      </div>
    </div>
  );
};

export default AboutPlaceholder;
