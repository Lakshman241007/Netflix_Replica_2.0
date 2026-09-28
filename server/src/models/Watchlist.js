import mongoose from 'mongoose';
import { MockModel } from '../config/db.js';

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
    index: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
  },
  // Compatibility fields
  videoId: {
    type: String
  },
  videoType: {
    type: String,
    default: 'movie'
  }
}, {
  timestamps: true
});

watchlistSchema.index({ profileId: 1, movieId: 1 }, { unique: true });

const MongooseWatchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema);
const mockWatchlist = new MockModel('watchlists');

class WatchlistProxy {
  static get schema() {
    return watchlistSchema;
  }

  static async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchlist.find(filter).lean();
    }
    return await mockWatchlist.find(filter);
  }

  static async findOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchlist.findOne(filter).lean();
    }
    return await mockWatchlist.findOne(filter);
  }

  static async create(data) {
    const payload = {
      ...data,
      movieId: data.movieId || data.videoId,
      videoId: data.videoId || data.movieId
    };
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchlist.create(payload);
    }
    return await mockWatchlist.create(payload);
  }

  static async deleteOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchlist.deleteOne(filter);
    }
    return await mockWatchlist.deleteOne(filter);
  }

  static async deleteMany(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchlist.deleteMany(filter);
    }
    return await mockWatchlist.deleteMany(filter);
  }

  static async countDocuments(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchlist.countDocuments(filter);
    }
    return await mockWatchlist.countDocuments(filter);
  }
}

export default WatchlistProxy;
