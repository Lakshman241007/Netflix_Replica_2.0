import React, { useState, useEffect } from 'react';
import { getMovies, getShows, createMovie, createShow, createEpisode, deleteMovie, deleteShow } from '../services/movieService.js';
import { Plus, Trash2, Video, Film, Users, LayoutDashboard, PlusCircle, RefreshCw } from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'add-movie', 'add-show', 'add-episode'
  
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Movie Form State
  const [movieTitle, setMovieTitle] = useState('');
  const [movieDesc, setMovieDesc] = useState('');
  const [movieThumbnail, setMovieThumbnail] = useState('');
  const [movieVideo, setMovieVideo] = useState('');
  const [movieDuration, setMovieDuration] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieRating, setMovieRating] = useState('PG-13');
  const [movieGenres, setMovieGenres] = useState('');
  const [movieCast, setMovieCast] = useState('');
  const [movieIsFeatured, setMovieIsFeatured] = useState(false);

  // Show Form State
  const [showTitle, setShowTitle] = useState('');
  const [showDesc, setShowDesc] = useState('');
  const [showThumbnail, setShowThumbnail] = useState('');
  const [showYear, setShowYear] = useState('');
  const [showRating, setShowRating] = useState('TV-14');
  const [showGenres, setShowGenres] = useState('');
  const [showCast, setShowCast] = useState('');
  const [showSeasons, setShowSeasons] = useState(1);

  // Episode Form State
  const [epShowId, setEpShowId] = useState('');
  const [epTitle, setEpTitle] = useState('');
  const [epDesc, setEpDesc] = useState('');
  const [epThumbnail, setEpThumbnail] = useState('');
  const [epVideo, setEpVideo] = useState('');
  const [epDuration, setEpDuration] = useState('');
  const [epSeason, setEpSeason] = useState(1);
  const [epNumber, setEpNumber] = useState(1);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const [movRes, shoRes] = await Promise.all([getMovies(), getShows()]);
      setMovies(movRes.data || []);
      setShows(shoRes.data || []);
      if (shoRes.data && shoRes.data.length > 0) {
        setEpShowId(shoRes.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const flashMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 5000);
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const genresArray = movieGenres.split(',').map(g => g.trim()).filter(Boolean);
      const castArray = movieCast.split(',').map(c => c.trim()).filter(Boolean);

      await createMovie({
        title: movieTitle,
        description: movieDesc,
        thumbnailUrl: movieThumbnail || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
        videoUrl: movieVideo || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: movieDuration || '2h 0m',
        year: Number(movieYear) || 2026,
        rating: movieRating,
        genres: genresArray,
        cast: castArray,
        isFeatured: movieIsFeatured
      });

      flashMessage('Movie created successfully!');
      // Reset
      setMovieTitle('');
      setMovieDesc('');
      setMovieThumbnail('');
      setMovieVideo('');
      setMovieDuration('');
      setMovieYear('');
      setMovieGenres('');
      setMovieCast('');
      setMovieIsFeatured(false);
      loadMedia();
      setActiveTab('list');
    } catch (err) {
      flashMessage(err.message || 'Error creating movie', 'error');
    }
  };

  const handleAddShow = async (e) => {
    e.preventDefault();
    try {
      const genresArray = showGenres.split(',').map(g => g.trim()).filter(Boolean);
      const castArray = showCast.split(',').map(c => c.trim()).filter(Boolean);

      await createShow({
        title: showTitle,
        description: showDesc,
        thumbnailUrl: showThumbnail || 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
        year: Number(showYear) || 2026,
        rating: showRating,
        genres: genresArray,
        cast: castArray,
        seasonsCount: Number(showSeasons) || 1
      });

      flashMessage('TV Show created successfully!');
      setShowTitle('');
      setShowDesc('');
      setShowThumbnail('');
      setShowYear('');
      setShowGenres('');
      setShowCast('');
      setShowSeasons(1);
      loadMedia();
      setActiveTab('list');
    } catch (err) {
      flashMessage(err.message || 'Error creating TV Show', 'error');
    }
  };

  const handleAddEpisode = async (e) => {
    e.preventDefault();
    if (!epShowId) {
      flashMessage('Please select or create a TV show first.', 'error');
      return;
    }
    try {
      await createEpisode({
        showId: epShowId,
        title: epTitle,
        description: epDesc,
        thumbnailUrl: epThumbnail || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
        videoUrl: epVideo || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        duration: epDuration || '45m',
        season: Number(epSeason),
        episodeNumber: Number(epNumber)
      });

      flashMessage('Episode uploaded and associated successfully!');
      setEpTitle('');
      setEpDesc('');
      setEpThumbnail('');
      setEpVideo('');
      setEpDuration('');
      setEpSeason(1);
      setEpNumber(1);
      setActiveTab('list');
    } catch (err) {
      flashMessage(err.message || 'Error creating episode', 'error');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        flashMessage('Movie deleted.');
        loadMedia();
      } catch (err) {
        flashMessage('Failed to delete movie.', 'error');
      }
    }
  };

  const handleDeleteShow = async (id) => {
    if (window.confirm('Are you sure you want to delete this TV show?')) {
      try {
        await deleteShow(id);
        flashMessage('TV Show deleted.');
        loadMedia();
      } catch (err) {
        flashMessage('Failed to delete TV show.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white px-4 md:px-16 py-10 select-none animate-fade-in">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-extrabold tracking-wide">Netflix Admin Console</h1>
        </div>
        <button
          onClick={loadMedia}
          className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-900/50 text-xs px-3 py-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reload Catalog
        </button>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-md mb-6 text-sm font-semibold ${msg.type === 'error' ? 'bg-red-900/80 border border-red-700 text-red-200' : 'bg-green-900/80 border border-green-700 text-green-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800/80 rounded p-4 flex items-center gap-4">
          <Film className="w-10 h-10 text-red-600 bg-red-600/10 p-2 rounded" />
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Movies</p>
            <p className="text-2xl font-black mt-0.5">{movies.length}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800/80 rounded p-4 flex items-center gap-4">
          <Video className="w-10 h-10 text-red-600 bg-red-600/10 p-2 rounded" />
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">TV Series</p>
            <p className="text-2xl font-black mt-0.5">{shows.length}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800/80 rounded p-4 flex items-center gap-4 col-span-2 md:col-span-1">
          <Users className="w-10 h-10 text-red-600 bg-red-600/10 p-2 rounded" />
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Demo Users</p>
            <p className="text-2xl font-black mt-0.5">2</p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-zinc-800 pb-4 mb-8 text-xs font-semibold uppercase">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded transition ${activeTab === 'list' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          Catalog List
        </button>
        <button
          onClick={() => setActiveTab('add-movie')}
          className={`px-4 py-2 rounded transition ${activeTab === 'add-movie' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          + Add Movie
        </button>
        <button
          onClick={() => setActiveTab('add-show')}
          className={`px-4 py-2 rounded transition ${activeTab === 'add-show' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          + Add TV Show
        </button>
        <button
          onClick={() => setActiveTab('add-episode')}
          className={`px-4 py-2 rounded transition ${activeTab === 'add-episode' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          + Add Episode
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'list' && (
        <div className="flex flex-col gap-6">
          {/* Movies List */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">Movies Catalog</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden text-xs">
              {movies.length === 0 ? (
                <p className="text-zinc-500 p-4">No movies uploaded yet.</p>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {movies.map((m) => (
                    <div key={m._id} className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-800/40 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={m.thumbnailUrl} className="w-12 h-8 object-cover rounded bg-zinc-800 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate text-sm">{m.title}</p>
                          <p className="text-zinc-500 mt-0.5 truncate">{m.genres.join(', ')} • {m.year} • {m.duration}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMovie(m._id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TV Shows List */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">TV Series Catalog</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden text-xs">
              {shows.length === 0 ? (
                <p className="text-zinc-500 p-4">No TV shows uploaded yet.</p>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {shows.map((s) => (
                    <div key={s._id} className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-800/40 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={s.thumbnailUrl} className="w-12 h-8 object-cover rounded bg-zinc-800 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate text-sm">{s.title}</p>
                          <p className="text-zinc-500 mt-0.5 truncate">{s.genres.join(', ')} • {s.year} • {s.seasonsCount} Season{s.seasonsCount > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteShow(s._id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'add-movie' && (
        <form onSubmit={handleAddMovie} className="bg-zinc-900 border border-zinc-800 p-6 rounded max-w-2xl flex flex-col gap-4 text-xs">
          <h3 className="text-base font-bold mb-2">Upload Movie Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Title</label>
              <input type="text" value={movieTitle} onChange={e => setMovieTitle(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Release Year</label>
              <input type="number" value={movieYear} onChange={e => setMovieYear(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 font-semibold">Description</label>
            <textarea rows={3} value={movieDesc} onChange={e => setMovieDesc(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500 resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Duration (e.g. 2h 5m)</label>
              <input type="text" value={movieDuration} onChange={e => setMovieDuration(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Rating Select</label>
              <select value={movieRating} onChange={e => setMovieRating(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500">
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="TV-MA">TV-MA</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Featured Title?</label>
              <div className="flex items-center gap-2 h-full">
                <input type="checkbox" checked={movieIsFeatured} onChange={e => setMovieIsFeatured(e.target.checked)} className="w-4 h-4 accent-red-600" />
                <span>Show in Hero Row</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Genres (Comma separated)</label>
              <input type="text" placeholder="Action, Thriller, Sci-Fi" value={movieGenres} onChange={e => setMovieGenres(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Cast (Comma separated)</label>
              <input type="text" placeholder="Dwayne Johnson, Ryan Reynolds" value={movieCast} onChange={e => setMovieCast(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 font-semibold">Poster URL (Unsplash/Web link)</label>
            <input type="url" placeholder="https://..." value={movieThumbnail} onChange={e => setMovieThumbnail(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 font-semibold">Video Stream URL (.mp4 file link)</label>
            <input type="url" placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" value={movieVideo} onChange={e => setMovieVideo(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
          </div>
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded mt-4 uppercase">
            Create Movie
          </button>
        </form>
      )}

      {activeTab === 'add-show' && (
        <form onSubmit={handleAddShow} className="bg-zinc-900 border border-zinc-800 p-6 rounded max-w-2xl flex flex-col gap-4 text-xs">
          <h3 className="text-base font-bold mb-2">Create TV Series</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-zinc-400 font-semibold">Title</label>
              <input type="text" value={showTitle} onChange={e => setShowTitle(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Total Seasons</label>
              <input type="number" min={1} value={showSeasons} onChange={e => setShowSeasons(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Release Year</label>
              <input type="number" value={showYear} onChange={e => setShowYear(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Rating Select</label>
              <select value={showRating} onChange={e => setShowRating(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500">
                <option value="TV-G">TV-G</option>
                <option value="TV-PG">TV-PG</option>
                <option value="TV-14">TV-14</option>
                <option value="TV-MA">TV-MA</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 font-semibold">Description</label>
            <textarea rows={3} value={showDesc} onChange={e => setShowDesc(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Genres (Comma separated)</label>
              <input type="text" placeholder="Action, Sci-Fi" value={showGenres} onChange={e => setShowGenres(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Cast (Comma separated)</label>
              <input type="text" placeholder="Jenna Ortega, David Harbour" value={showCast} onChange={e => setShowCast(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 font-semibold">Poster URL (Unsplash/Web link)</label>
            <input type="url" placeholder="https://..." value={showThumbnail} onChange={e => setShowThumbnail(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
          </div>
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded mt-4 uppercase">
            Create TV Series
          </button>
        </form>
      )}

      {activeTab === 'add-episode' && (
        <form onSubmit={handleAddEpisode} className="bg-zinc-900 border border-zinc-800 p-6 rounded max-w-2xl flex flex-col gap-4 text-xs">
          <h3 className="text-base font-bold mb-2">Upload TV Show Episode</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 font-semibold">Select TV Series Link</label>
            <select
              value={epShowId}
              onChange={e => setEpShowId(e.target.value)}
              required
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500"
            >
              <option value="">-- Choose Series --</option>
              {shows.map(s => (
                <option key={s._id} value={s._id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 font-semibold">Episode Title</label>
              <input type="text" value={epTitle} onChange={e => setEpTitle(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 font-semibold">Season #</label>
                <input type="number" min={1} value={epSeason} onChange={e => setEpSeason(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 font-semibold">Episode #</label>
                <input type="number" min={1} value={epNumber} onChange={e => setEpNumber(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 font-semibold">Duration</label>
                <input type="text" placeholder="45m" value={epDuration} onChange={e => setEpDuration(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 font-semibold">Episode Description</label>
            <textarea rows={3} value={epDesc} onChange={e => setEpDesc(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500 resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 font-semibold">Episode Thumbnail Poster URL</label>
            <input type="url" placeholder="https://..." value={epThumbnail} onChange={e => setEpThumbnail(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 font-semibold">Episode Video Stream URL (.mp4 link)</label>
            <input type="url" placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" value={epVideo} onChange={e => setEpVideo(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 outline-none text-white focus:border-zinc-500" />
          </div>

          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded mt-4 uppercase">
            Create Episode
          </button>
        </form>
      )}
    </div>
  );
};
export default AdminDashboard;
