import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext.jsx';
import { PlayerContext } from '../context/PlayerContext.jsx';
import { getMovies, getShows, getEpisodes } from '../services/movieService.js';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/watchlistService.js';
import { getWatchHistory } from '../services/playbackService.js';
import { Play, Info, Plus, Check, Volume2, VolumeX, X, Star, Calendar, Clock } from 'lucide-react';

export const Browse = () => {
  const { activeProfile } = useContext(ProfileContext);
  const { startPlaying } = useContext(PlayerContext);
  
  const [featuredItem, setFeaturedItem] = useState(null);
  const [trending, setTrending] = useState([]);
  const [actionHits, setActionHits] = useState([]);
  const [sciFi, setSciFi] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    if (!activeProfile) return;
    try {
      const [moviesRes, showsRes, watchlistRes, historyRes] = await Promise.all([
        getMovies(),
        getShows(),
        getWatchlist(activeProfile._id),
        getWatchHistory(activeProfile._id)
      ]);

      const allMovies = moviesRes.data || [];
      const allShows = showsRes.data || [];
      const combined = [...allMovies, ...allShows];

      // Shuffle combined to make "Trending"
      const shuffled = [...combined].sort(() => 0.5 - Math.random());
      setTrending(shuffled.slice(0, 8));

      // Filter featured
      const featured = allMovies.find(m => m.isFeatured) || allMovies[0] || allShows[0];
      setFeaturedItem(featured);

      // Filter rows
      setActionHits(combined.filter(item => 
        (item.genres || []).some(g => g.toLowerCase().includes('action') || g.toLowerCase().includes('thriller'))
      ));

      setSciFi(combined.filter(item => 
        (item.genres || []).some(g => g.toLowerCase().includes('sci-fi') || g.toLowerCase().includes('fantasy'))
      ));

      setWatchlist(watchlistRes.data || []);
      setWatchHistory(historyRes.data || []);
    } catch (err) {
      console.error('Failed to load browse content:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProfile]);

  const handleOpenModal = async (item) => {
    setSelectedItem(item);
    setModalOpen(true);
    setEpisodes([]);

    // Check if it's a TV show to fetch episodes
    const isTV = !item.duration;
    if (isTV) {
      setEpisodesLoading(true);
      try {
        const res = await getEpisodes(item._id);
        if (res.success) {
          setEpisodes(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching episodes:', err);
      } finally {
        setEpisodesLoading(false);
      }
    }
  };

  const handlePlay = (item, type) => {
    startPlaying(item, type);
    navigate(`/player/${item._id}`);
  };

  const handlePlayEpisode = (episode, showTitle) => {
    startPlaying({
      ...episode,
      title: `${showTitle} - S${episode.season}E${episode.episodeNumber}: ${episode.title}`
    }, 'episode');
    navigate(`/player/${episode._id}`);
  };

  const isInWatchlist = (videoId) => {
    return watchlist.some(w => w.videoId === videoId);
  };

  const toggleWatchlist = async (e, item) => {
    e.stopPropagation();
    const type = item.duration ? 'movie' : 'show';
    try {
      if (isInWatchlist(item._id)) {
        await removeFromWatchlist(activeProfile._id, item._id);
      } else {
        await addToWatchlist(activeProfile._id, item._id, type);
      }
      // Reload watchlist
      const res = await getWatchlist(activeProfile._id);
      setWatchlist(res.data || []);
    } catch (err) {
      console.error('Error toggling watchlist:', err);
    }
  };

  const renderMediaCard = (item) => {
    const isMovie = !!item.duration;
    const historyRecord = watchHistory.find(h => h.videoId === item._id);
    const progressPercent = historyRecord && historyRecord.duration > 0
      ? (historyRecord.progress / historyRecord.duration) * 100
      : 0;

    return (
      <div
        key={item._id}
        onClick={() => handleOpenModal(item)}
        className="flex-shrink-0 w-44 md:w-56 bg-zinc-900 rounded overflow-hidden shadow-lg cursor-pointer group hover:scale-105 transition-all duration-300 relative select-none"
      >
        <div className="relative aspect-video w-full bg-zinc-800">
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300"
          />

          {/* Inline continue-watching progress bar */}
          {historyRecord && progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700/50">
              <div className="bg-red-600 h-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          )}
        </div>

        {/* Info label */}
        <div className="p-3">
          <div className="flex justify-between items-start mb-1.5">
            <h4 className="text-xs md:text-sm font-semibold truncate flex-grow pr-2">{item.title}</h4>
            <button
              onClick={(e) => toggleWatchlist(e, item)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {isInWatchlist(item._id) ? <Check className="w-4 h-4 text-green-500" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex gap-2 items-center text-[10px] text-zinc-400">
            <span className="border border-zinc-700 px-1 py-0.2 rounded font-bold uppercase tracking-wider">{item.rating}</span>
            <span>{item.year}</span>
            <span>{isMovie ? item.duration : `${item.seasonsCount} Season${item.seasonsCount > 1 ? 's' : ''}`}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#141414] pb-12 overflow-x-hidden select-none animate-fade-in">
      {/* Featured Banner Hero */}
      {featuredItem && (
        <section 
          className="relative h-[45vh] md:h-[80vh] flex items-end justify-start bg-cover bg-center px-6 md:px-16 pb-12 md:pb-24"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(20,20,20,1)), url('${featuredItem.thumbnailUrl}')`
          }}
        >
          <div className="max-w-xl z-10">
            <h1 className="text-3xl md:text-6xl font-extrabold tracking-wide mb-4 leading-tight">{featuredItem.title}</h1>
            <p className="text-zinc-300 text-xs md:text-sm line-clamp-3 md:line-clamp-4 leading-relaxed mb-6 md:mb-8 shadow-2xl">
              {featuredItem.description}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handlePlay(featuredItem, featuredItem.duration ? 'movie' : 'show')}
                className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs md:text-sm px-6 py-2.5 md:py-3 rounded flex items-center gap-2 transition duration-200 shadow-lg"
              >
                <Play className="w-4 h-4 md:w-5 h-5 fill-current" /> Play
              </button>
              <button
                onClick={() => handleOpenModal(featuredItem)}
                className="bg-zinc-600/60 hover:bg-zinc-600/80 text-white font-semibold text-xs md:text-sm px-6 py-2.5 md:py-3 rounded flex items-center gap-2 transition duration-200 border border-zinc-500/30 shadow-lg"
              >
                <Info className="w-4 h-4 md:w-5 h-5" /> More Info
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Categories / Content Rows */}
      <div className="px-4 md:px-16 flex flex-col gap-10 -mt-8 relative z-20">
        {/* Continue Watching (Only show if watch history exists) */}
        {watchHistory.length > 0 && (
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-zinc-100">
              Continue Watching as {activeProfile?.name}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {watchHistory.map((historyItem) => {
                const content = historyItem.content;
                if (!content) return null;
                return renderMediaCard(content);
              })}
            </div>
          </div>
        )}

        {/* Trending Now Row */}
        <div>
          <h2 className="text-lg md:text-xl font-bold mb-4 text-zinc-100">Trending Now</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {trending.map(renderMediaCard)}
          </div>
        </div>

        {/* Action Hits Row */}
        {actionHits.length > 0 && (
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-4 text-zinc-100">Blockbuster Thrillers & Action</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {actionHits.map(renderMediaCard)}
            </div>
          </div>
        )}

        {/* Sci-Fi wonders */}
        {sciFi.length > 0 && (
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-4 text-zinc-100">Sci-Fi & Fantasy Wonders</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {sciFi.map(renderMediaCard)}
            </div>
          </div>
        )}
      </div>

      {/* --- MEDIA DETAIL MODAL --- */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-md w-full max-w-3xl overflow-hidden shadow-2xl relative my-8 animate-scale-up">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 border border-zinc-700 z-10 transition duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Poster Banner */}
            <div
              className="relative h-64 md:h-96 bg-cover bg-center flex items-end justify-start px-6 md:px-12 pb-6 md:pb-10"
              style={{
                backgroundImage: `linear-gradient(rgba(20,20,20,0.1), rgba(20,20,20,1)), url('${selectedItem.thumbnailUrl}')`
              }}
            >
              <div className="z-10">
                <h3 className="text-2xl md:text-4xl font-extrabold mb-4">{selectedItem.title}</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      handlePlay(selectedItem, selectedItem.duration ? 'movie' : 'show');
                    }}
                    className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs md:text-sm px-6 py-2 md:py-2.5 rounded flex items-center gap-2 transition duration-200"
                  >
                    <Play className="w-4 h-4 fill-current" /> Play
                  </button>
                  <button
                    onClick={(e) => toggleWatchlist(e, selectedItem)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs py-2 px-3 rounded flex items-center gap-1.5 transition"
                  >
                    {isInWatchlist(selectedItem._id) ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" /> Watchlisted
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> My List
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Details Grid */}
            <div className="px-6 md:px-12 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left detail Column */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="flex flex-wrap gap-2.5 items-center text-xs text-zinc-400">
                  <span className="border border-zinc-700 text-zinc-300 font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">{selectedItem.rating}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedItem.year}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedItem.duration || `${episodes.length || selectedItem.seasonsCount} Episodes`}</span>
                </div>

                <p className="text-zinc-200 text-xs md:text-sm leading-relaxed">{selectedItem.description}</p>
              </div>

              {/* Right metadata Column */}
              <div className="flex flex-col gap-3 text-xs md:text-sm">
                <div>
                  <span className="text-zinc-500">Cast: </span>
                  <span className="text-zinc-300">{(selectedItem.cast || []).join(', ') || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Genres: </span>
                  <span className="text-zinc-300">{(selectedItem.genres || []).join(', ') || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* --- TV Show Episodes Selector (Only for Shows) --- */}
            {!selectedItem.duration && (
              <div className="px-6 md:px-12 pb-10 border-t border-zinc-800/80 pt-6">
                <h4 className="text-lg font-bold mb-4">Episodes</h4>
                {episodesLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : episodes.length === 0 ? (
                  <p className="text-zinc-500 text-xs py-4">No episodes available yet for this season.</p>
                ) : (
                  <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
                    {episodes.map((episode) => (
                      <div
                        key={episode._id}
                        onClick={() => {
                          setModalOpen(false);
                          handlePlayEpisode(episode, selectedItem.title);
                        }}
                        className="flex gap-4 p-2 bg-zinc-800/40 hover:bg-zinc-800/80 rounded cursor-pointer border border-transparent hover:border-zinc-700/50 transition duration-200 group"
                      >
                        <div className="relative w-24 md:w-32 aspect-video bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                          <img src={episode.thumbnailUrl} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                            <Play className="w-6 h-6 text-white fill-current" />
                          </div>
                        </div>
                        <div className="flex-grow flex flex-col justify-center text-xs">
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="font-semibold text-zinc-100 text-sm">{episode.episodeNumber}. {episode.title}</h5>
                            <span className="text-zinc-400 text-[10px]">{episode.duration}</span>
                          </div>
                          <p className="text-zinc-400 line-clamp-2 md:line-clamp-3 leading-relaxed text-[11px]">{episode.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Browse;
