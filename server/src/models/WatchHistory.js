import mongoose from 'mongoose';
import { MockModel } from '../config/db.js';

const watchHistorySchema = new mongoose.Schema({
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
  position: {
    type: Number,
    default: 0,
    min: 0
  },
  duration: {
    type: Number,
    default: 0,
    min: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  watchedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
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

watchHistorySchema.index({ profileId: 1, movieId: 1 }, { unique: true });
watchHistorySchema.index({ profileId: 1, watchedAt: -1 });

const MongooseWatchHistory = mongoose.models.WatchHistory || mongoose.model('WatchHistory', watchHistorySchema);
const mockWatchHistory = new MockModel('watchhistories');

function matchWatchHistoryFilter(item, filter) {
  if (!item) return false;
  for (const key in filter) {
    if (key === '$or' && Array.isArray(filter.$or)) {
      const orMatched = filter.$or.some((subFilter) => matchWatchHistoryFilter(item, subFilter));
      if (!orMatched) return false;
    } else if (key === '_id' || key === 'id') {
      const itemId = String(item._id || item.id || '');
      const filterId = String(filter[key]);
      if (itemId !== filterId) return false;
    } else if (key === 'profileId') {
      if (String(item.profileId) !== String(filter.profileId)) return false;
    } else if (key === 'userId') {
      if (String(item.userId) !== String(filter.userId)) return false;
    } else if (key === 'movieId' || key === 'videoId') {
      const itemMovieId = String(item.movieId || item.videoId || '');
      const filterMovieId = String(filter[key]);
      if (itemMovieId !== filterMovieId) return false;
    } else if (key === 'completed' && filter.completed !== undefined) {
      if (item.completed !== filter.completed) return false;
    } else if (filter[key] !== undefined && item[key] !== filter[key]) {
      return false;
    }
  }
  return true;
}

class WatchHistoryProxy {
  static get schema() {
    return watchHistorySchema;
  }

  static async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchHistory.find(filter).lean();
    }
    const all = await mockWatchHistory.find({});
    return all.filter((item) => matchWatchHistoryFilter(item, filter));
  }

  static async findOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchHistory.findOne(filter).lean();
    }
    const all = await mockWatchHistory.find({});
    return all.find((item) => matchWatchHistoryFilter(item, filter)) || null;
  }

  static async create(data) {
    const payload = {
      ...data,
      movieId: data.movieId || data.videoId,
      videoId: data.videoId || data.movieId,
      watchedAt: data.watchedAt || new Date()
    };
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchHistory.create(payload);
    }
    return await mockWatchHistory.create(payload);
  }

  static async findOneAndUpdate(filter, update, options = {}) {
    const payload = { ...update };
    if (payload.movieId || payload.videoId) {
      payload.movieId = payload.movieId || payload.videoId;
      payload.videoId = payload.videoId || payload.movieId;
    }
    payload.watchedAt = payload.watchedAt || new Date();

    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchHistory.findOneAndUpdate(filter, payload, {
        new: true,
        upsert: options.upsert || false,
        ...options
      }).lean();
    }

    const existing = await this.findOne(filter);
    if (existing) {
      Object.assign(existing, payload, { updatedAt: new Date().toISOString() });
      return existing;
    }
    if (options.upsert) {
      const basePayload = {};
      for (const k in filter) {
        if (k !== '$or') basePayload[k] = filter[k];
      }
      return await this.create({
        ...basePayload,
        ...payload
      });
    }
    return null;
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchHistory.findByIdAndUpdate(id, update, { new: true, ...options }).lean();
    }
    return await mockWatchHistory.findByIdAndUpdate(id, update);
  }

  static async deleteOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchHistory.deleteOne(filter);
    }
    const target = await this.findOne(filter);
    if (target) {
      return await mockWatchHistory.deleteOne({ id: target.id || target._id });
    }
    return { deletedCount: 0 };
  }

  static async deleteMany(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchHistory.deleteMany(filter);
    }
    const itemsToDelete = await this.find(filter);
    for (const item of itemsToDelete) {
      await mockWatchHistory.deleteOne({ id: item.id || item._id });
    }
    return { deletedCount: itemsToDelete.length };
  }

  static async countDocuments(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseWatchHistory.countDocuments(filter);
    }
    const matches = await this.find(filter);
    return matches.length;
  }
}

export default WatchHistoryProxy;
