import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [resumePosition, setResumePosition] = useState(0);

  const startPlaying = (video, videoType = 'movie', startPosition = 0) => {
    setResumePosition(startPosition);
    setPlayingVideo({
      ...video,
      videoType
    });
  };

  const stopPlaying = () => {
    setPlayingVideo(null);
    setResumePosition(0);
  };

  return (
    <PlayerContext.Provider
      value={{
        playingVideo,
        currentMovie: playingVideo,
        startPlaying,
        playMovie: startPlaying,
        stopPlaying,
        stopPlayback: stopPlaying,
        resumePosition,
        setResumePosition
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
