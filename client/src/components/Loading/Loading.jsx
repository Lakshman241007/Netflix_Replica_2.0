import React from 'react';

export const Loading = ({ message = 'Loading movies...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-zinc-300">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium tracking-wide text-zinc-400">{message}</p>
    </div>
  );
};

export default Loading;
