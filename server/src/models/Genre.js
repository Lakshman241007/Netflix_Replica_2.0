import mongoose from 'mongoose';
import { MockModel } from '../config/db.js';

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

const MongooseGenre = mongoose.models.Genre || mongoose.model('Genre', genreSchema);
const mockGenre = new MockModel('genres');

class GenreProxy {
  static get schema() {
    return genreSchema;
  }

  static async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseGenre.find(filter).lean();
    }
    return await mockGenre.find(filter);
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseGenre.findById(id).lean();
    }
    return await mockGenre.findById(id);
  }

  static async findOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseGenre.findOne(filter).lean();
    }
    return await mockGenre.findOne(filter);
  }

  static async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseGenre.create(data);
    }
    return await mockGenre.create(data);
  }

  static async insertMany(items) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseGenre.insertMany(items);
    }
    return await mockGenre.insertMany(items);
  }

  static async countDocuments(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseGenre.countDocuments(filter);
    }
    return await mockGenre.countDocuments(filter);
  }

  static async deleteOne(filter) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseGenre.deleteOne(filter);
    }
    return await mockGenre.deleteOne(filter);
  }

  static async deleteMany(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseGenre.deleteMany(filter);
    }
    return await mockGenre.deleteMany(filter);
  }
}

export default GenreProxy;
