import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  AlertCircle,
  RotateCw as ReloadIcon
} from 'lucide-react';
import { formatSeconds } from '../../utils/formatTime.js';

const DEMO_FALLBACK_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const VideoPlayer = ({
  videoUrl,
  title,
  initialPosition = 0,
  onProgressUpdate,
  onComplete,
  onBack
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [resumeToast, setResumeToast] = useState(false);
  const initialPositionAppliedRef = useRef(false);

  const effectiveVideoUrl = videoUrl || DEMO_FALLBACK_VIDEO;

  // Metadata loaded -> set duration & resume from initialPosition
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || 0;
    setDuration(dur);
    setIsBuffering(false);

    if (!initialPositionAppliedRef.current && initialPosition > 5 && initialPosition < dur - 5) {
      videoRef.current.currentTime = initialPosition;
      setCurrentTime(initialPosition);
      initialPositionAppliedRef.current = true;
      setResumeToast(true);
      setTimeout(() => setResumeToast(false), 4500);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    if (duration > 0 && curr >= duration - 0.5) {
      if (onComplete) onComplete();
    }
  };

  // Periodic progress sync (every 10 seconds while playing)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (videoRef.current && onProgressUpdate) {
        onProgressUpdate(videoRef.current.currentTime, videoRef.current.duration, true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlaying, onProgressUpdate]);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (onProgressUpdate) {
        onProgressUpdate(videoRef.current.currentTime, videoRef.current.duration, false);
      }
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => {
          console.warn('Playback play request prevented:', err.message);
        });
    }
  }, [isPlaying, onProgressUpdate]);

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = Number(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    if (onProgressUpdate) {
      onProgressUpdate(seekTime, duration, isPlaying);
    }
  };

  const handleSkip = (seconds) => {
    if (!videoRef.current) return;
    let newTime = videoRef.current.currentTime + seconds;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    if (onProgressUpdate) {
      onProgressUpdate(newTime, duration, isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 3000);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSkip(10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSkip(-10);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [togglePlayPause, isFullscreen]);

  const handleExit = () => {
    if (videoRef.current && onProgressUpdate) {
      onProgressUpdate(videoRef.current.currentTime, videoRef.current.duration, false);
    }
    if (onBack) onBack();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 bg-black z-50 overflow-hidden flex items-center justify-center select-none"
    >
      {/* Video Element */}
      {!videoError ? (
        <video
          ref={videoRef}
          src={effectiveVideoUrl}
          className="w-full h-full object-contain cursor-pointer"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => {
            setIsBuffering(false);
            setIsPlaying(true);
          }}
          onError={() => {
            setIsBuffering(false);
            setVideoError(true);
          }}
          onClick={togglePlayPause}
          playsInline
        />
      ) : (
        /* Video Error / Unavailable state */
        <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-white mb-2">Playback Unavailable</h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            The media stream could not be loaded or is temporarily offline.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setVideoError(false);
                setIsBuffering(true);
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-5 rounded transition"
            >
              <ReloadIcon className="w-4 h-4" /> Retry
            </button>
            <button
              onClick={handleExit}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2.5 px-5 rounded transition"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Buffering Indicator */}
      {isBuffering && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Resume Toast Banner */}
      {resumeToast && !videoError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/95 border border-zinc-700 backdrop-blur px-5 py-2.5 rounded-lg shadow-2xl flex items-center gap-4 text-white text-xs sm:text-sm animate-fade-in pointer-events-auto">
          <span>Resumed from <span className="font-mono font-bold text-red-500">{formatSeconds(initialPosition)}</span></span>
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                setCurrentTime(0);
                if (onProgressUpdate) onProgressUpdate(0, duration, isPlaying);
              }
              setResumeToast(false);
            }}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white px-2.5 py-1 rounded text-xs font-semibold transition"
          >
            Start Over
          </button>
        </div>
      )}

      {/* Initial Play Overlay Prompt (if autoplay was prevented) */}
      {!hasStarted && !isBuffering && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={togglePlayPause}
            className="w-20 h-20 rounded-full bg-red-600/90 hover:bg-red-600 hover:scale-110 flex items-center justify-center text-white shadow-2xl transition-all duration-200"
            aria-label="Start playback"
          >
            <Play className="w-10 h-10 fill-current ml-1" />
          </button>
        </div>
      )}

      {/* --- OVERLAY CONTROLS --- */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-8 transition-opacity duration-300 bg-gradient-to-t from-black/85 via-transparent to-black/75 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleExit}
            aria-label="Back to movie details"
            className="text-white hover:text-red-500 p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div>
            <h1 className="text-base sm:text-2xl font-bold tracking-wide text-white drop-shadow">
              {title || 'Netflix Stream'}
            </h1>
            <p className="text-zinc-400 text-xs mt-0.5">Now Playing</p>
          </div>
        </div>

        {/* Center Big Play Indicator (Click feedback) */}
        <div className="flex items-center justify-center pointer-events-none">
          {/* Subtle center spacer */}
        </div>

        {/* Bottom Controls Panel */}
        <div className="flex flex-col gap-3 w-full max-w-5xl mx-auto">
          {/* Timeline slider row */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xs font-semibold text-zinc-300 min-w-[45px] text-right font-mono">
              {formatSeconds(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Seek time slider"
              className="flex-grow accent-red-600 h-1.5 hover:h-2 rounded bg-zinc-700 outline-none cursor-pointer transition-all"
            />
            <span className="text-xs font-semibold text-zinc-300 min-w-[45px] font-mono">
              {formatSeconds(Math.max(0, duration - currentTime))}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Left Controls: Play/Pause, -10s, +10s, Volume */}
            <div className="flex items-center gap-2.5 sm:gap-5 md:gap-6">
              {/* Play Pause Button */}
              <button
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="text-white hover:text-red-500 transition-colors p-1.5 focus:outline-none focus:ring-2 focus:ring-red-600 rounded active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                ) : (
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                )}
              </button>

              {/* Skip Back 10s */}
              <button
                onClick={() => handleSkip(-10)}
                aria-label="Rewind 10 seconds"
                className="text-white hover:text-zinc-300 transition-colors p-1.5 active:scale-95"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Skip Forward 10s */}
              <button
                onClick={() => handleSkip(10)}
                aria-label="Fast forward 10 seconds"
                className="text-white hover:text-zinc-300 transition-colors p-1.5 active:scale-95"
                title="Fast forward 10 seconds"
              >
                <RotateCw className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Volume block */}
              <div className="flex items-center gap-1.5 sm:gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="text-white hover:text-zinc-300 transition-colors p-1.5"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume slider"
                  className="hidden xs:block sm:block w-12 sm:w-20 accent-red-600 h-1 bg-zinc-700 outline-none cursor-pointer transition-all rounded"
                />
              </div>
            </div>

            {/* Right Controls: Quality Badge, Playback Speed, Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-4 relative">
              {/* Quality indicator badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-[10px] font-black text-zinc-300 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>HD • 1080P</span>
              </div>

              {/* Playback speed selector */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  aria-label={`Playback speed: ${playbackSpeed}x`}
                  className="text-white hover:text-zinc-300 flex items-center gap-1 text-[11px] sm:text-xs border border-zinc-500 rounded px-2 sm:px-2.5 py-1 font-semibold transition bg-black/40 min-h-[32px]"
                >
                  <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{playbackSpeed}x</span>
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-10 right-0 bg-zinc-900 border border-zinc-700 rounded p-1 shadow-2xl flex flex-col gap-1 w-24 z-50">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handleSpeedChange(sp)}
                        className={`text-xs hover:bg-zinc-800 rounded py-1.5 px-3 text-left transition-colors font-semibold ${
                          playbackSpeed === sp ? 'text-red-500' : 'text-zinc-300'
                        }`}
                      >
                        {sp}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Full-screen toggler */}
              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
                className="text-white hover:text-zinc-300 transition-colors p-1.5"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
