import mongoose from 'mongoose';
import { MockModel } from '../config/db.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscriptionStatus: { type: String, default: 'active' }
}, {
  timestamps: true
});

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);
const mockUser = new MockModel('users');

class UserProxy {
  static get schema() {
    return userSchema;
  }

  static async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.find(filter).lean();
    }
    return await mockUser.find(filter);
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.findById(id).lean();
    }
    return await mockUser.findById(id);
  }

  static async findOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.findOne(filter).lean();
    }
    return await mockUser.findOne(filter);
  }

  static async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.create(data);
    }
    return await mockUser.create(data);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.findByIdAndUpdate(id, data, { new: true, ...options }).lean();
    }
    return await mockUser.findByIdAndUpdate(id, data);
  }

  static async deleteOne(filter) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.deleteOne(filter);
    }
    return await mockUser.deleteOne(filter);
  }

  static async deleteMany(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.deleteMany(filter);
    }
    return await mockUser.deleteMany(filter);
  }

  static async countDocuments(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.countDocuments(filter);
    }
    return await mockUser.countDocuments(filter);
  }
}

export default UserProxy;
