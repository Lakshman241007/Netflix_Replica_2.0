import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext.jsx';
import { PlayerContext } from '../context/PlayerContext.jsx';
import { getShows, getEpisodes, getGenres } from '../services/movieService.js';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/watchlistService.js';
import { Play, Plus, Check, Info, X, Calendar, Clock } from 'lucide-react';

export const TVShows = () => {
  const { activeProfile } = useContext(ProfileContext);
  const { startPlaying } = useContext(PlayerContext);
  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);

  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    if (!activeProfile) return;
    setLoading(true);
    try {
      const [showsRes, genresRes, watchlistRes] = await Promise.all([
        getShows(selectedGenre),
        getGenres(),
        getWatchlist(activeProfile._id)
      ]);

      setShows(showsRes.data || []);
      setGenres(genresRes.data || []);
      setWatchlist(watchlistRes.data || []);
    } catch (err) {
      console.error('Failed to load TV Shows catalog', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProfile, selectedGenre]);

  const handleOpenModal = async (item) => {
    setSelectedItem(item);
    setModalOpen(true);
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
    try {
      if (isInWatchlist(item._id)) {
        await removeFromWatchlist(activeProfile._id, item._id);
      } else {
        await addToWatchlist(activeProfile._id, item._id, 'show');
      }
      const res = await getWatchlist(activeProfile._id);
      setWatchlist(res.data || []);
    } catch (err) {
      console.error('Error toggling watchlist:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white px-4 md:px-16 py-10 select-none animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-100">TV Shows</h1>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-black/80 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded px-3 py-1.5 text-xs font-semibold outline-none transition cursor-pointer"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g._id} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : shows.length === 0 ? (
        <p className="text-zinc-500 text-center py-20 text-sm">No TV Shows found under this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {shows.map((show) => (
            <div
              key={show._id}
              onClick={() => handleOpenModal(show)}
              className="group bg-zinc-900 rounded overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 relative"
            >
              <div className="aspect-video relative w-full bg-zinc-800">
                <img src={show.thumbnailUrl} alt={show.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="text-xs md:text-sm font-semibold truncate flex-grow pr-2">{show.title}</h4>
                  <button
                    onClick={(e) => toggleWatchlist(e, show)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {isInWatchlist(show._id) ? <Check className="w-4 h-4 text-green-500" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-2 items-center text-[10px] text-zinc-400">
                  <span className="border border-zinc-700 px-1 py-0.2 rounded font-bold uppercase">{show.rating}</span>
                  <span>{show.year}</span>
                  <span>{show.seasonsCount} Season{show.seasonsCount > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- DETAIL MODAL --- */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-md w-full max-w-3xl overflow-hidden shadow-2xl relative my-8 animate-scale-up">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 border border-zinc-700 z-10 transition duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative h-64 md:h-96 bg-cover bg-center flex items-end justify-start px-6 md:px-12 pb-6 md:pb-10"
              style={{
                backgroundImage: `linear-gradient(rgba(20,20,20,0.1), rgba(20,20,20,1)), url('${selectedItem.thumbnailUrl}')`
              }}
            >
              <div className="z-10">
                <h3 className="text-2xl md:text-4xl font-extrabold mb-4">{selectedItem.title}</h3>
                <button
                  onClick={(e) => toggleWatchlist(e, selectedItem)}
                  className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs py-2 px-4 rounded flex items-center gap-1.5 transition"
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

            <div className="px-6 md:px-12 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="flex flex-wrap gap-2.5 items-center text-xs text-zinc-400">
                  <span className="border border-zinc-700 text-zinc-300 font-bold px-1.5 py-0.5 rounded uppercase">{selectedItem.rating}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedItem.year}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {episodes.length} Episodes</span>
                </div>
                <p className="text-zinc-200 text-xs md:text-sm leading-relaxed">{selectedItem.description}</p>
              </div>
              <div className="flex flex-col gap-3 text-xs md:text-sm">
                <div>
                  <span className="text-zinc-500">Cast: </span>
                  <span className="text-zinc-300">{(selectedItem.cast || []).join(', ')}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Genres: </span>
                  <span className="text-zinc-300">{(selectedItem.genres || []).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Episodes List */}
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
                        <p className="text-zinc-400 line-clamp-2 leading-relaxed text-[11px]">{episode.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TVShows;
