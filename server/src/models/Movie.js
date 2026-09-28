import mongoose from 'mongoose';
import { MockModel } from '../config/db.js';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: String, default: '' },
  backdrop: { type: String, default: '' },
  releaseDate: { type: String, default: '' },
  rating: { type: String, default: 'PG-13' },
  duration: { type: String, default: '' },
  genres: [{ type: String }],
  trailer: { type: String, default: '' },
  video: { type: String, default: '' },
  type: { type: String, enum: ['movie', 'tv'], default: 'movie' },
  featured: { type: Boolean, default: false },
  popularity: { type: Number, default: 0 }
}, {
  timestamps: true
});

const MongooseMovie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
const mockMovie = new MockModel('movies');

class MovieProxy {
  static get schema() {
    return movieSchema;
  }

  static async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseMovie.find(filter).lean();
    }
    return await mockMovie.find(filter);
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseMovie.findById(id).lean();
    }
    return await mockMovie.findById(id);
  }

  static async findOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseMovie.findOne(filter).lean();
    }
    return await mockMovie.findOne(filter);
  }

  static async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseMovie.create(data);
    }
    return await mockMovie.create(data);
  }

  static async insertMany(items) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseMovie.insertMany(items);
    }
    return await mockMovie.insertMany(items);
  }

  static async countDocuments(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseMovie.countDocuments(filter);
    }
    return await mockMovie.countDocuments(filter);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseMovie.findByIdAndUpdate(id, data, { new: true, ...options }).lean();
    }
    return await mockMovie.findByIdAndUpdate(id, data);
  }

  static async deleteOne(filter) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseMovie.deleteOne(filter);
    }
    return await mockMovie.deleteOne(filter);
  }

  static async deleteMany(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseMovie.deleteMany(filter);
    }
    return await mockMovie.deleteMany(filter);
  }
}

export default MovieProxy;
