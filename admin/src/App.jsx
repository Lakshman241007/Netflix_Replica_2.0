import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-center items-center p-8 select-none">
      <div className="max-w-md text-center flex flex-col items-center">
        <span className="text-4xl font-extrabold text-red-600 tracking-wider mb-6">NETFLIX ADMIN</span>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-6 shadow-2xl mb-6">
          <p className="text-zinc-300 text-sm leading-relaxed mb-4">
            The Netflix administration dashboard has been seamlessly integrated into the main full-stack application for optimal performance and unified state management.
          </p>
          <p className="text-zinc-500 text-xs">
            To manage media files, TV shows, and episodes, please log in with an administrator account on the main website and navigate to the Admin portal.
          </p>
        </div>
        <a
          href="/"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded text-xs uppercase tracking-wider transition duration-300"
        >
          Go to Netflix Web App
        </a>
      </div>
    </div>
  );
}

export default App;
