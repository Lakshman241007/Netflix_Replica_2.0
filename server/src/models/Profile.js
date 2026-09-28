import mongoose from 'mongoose';
import { MockModel } from '../config/db.js';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
  avatar: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String
  },
  isKids: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

profileSchema.index({ userId: 1, name: 1 });

const MongooseProfile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
const mockProfile = new MockModel('profiles');

class ProfileProxy {
  static get schema() {
    return profileSchema;
  }

  static async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProfile.find(filter).lean();
    }
    return await mockProfile.find(filter);
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProfile.findById(id).lean();
    }
    return await mockProfile.findById(id);
  }

  static async findOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProfile.findOne(filter).lean();
    }
    return await mockProfile.findOne(filter);
  }

  static async create(data) {
    const payload = {
      ...data,
      avatarUrl: data.avatarUrl || data.avatar,
      avatar: data.avatar || data.avatarUrl
    };
    if (mongoose.connection.readyState === 1) {
      return await MongooseProfile.create(payload);
    }
    return await mockProfile.create(payload);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    const payload = {
      ...data,
      ...(data.avatar && { avatarUrl: data.avatar }),
      ...(data.avatarUrl && { avatar: data.avatarUrl })
    };
    if (mongoose.connection.readyState === 1) {
      return await MongooseProfile.findByIdAndUpdate(id, payload, { new: true, ...options }).lean();
    }
    return await mockProfile.findByIdAndUpdate(id, payload);
  }

  static async deleteOne(filter) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProfile.deleteOne(filter);
    }
    return await mockProfile.deleteOne(filter);
  }

  static async deleteMany(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProfile.deleteMany(filter);
    }
    return await mockProfile.deleteMany(filter);
  }

  static async countDocuments(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseProfile.countDocuments(filter);
    }
    return await mockProfile.countDocuments(filter);
  }
}

export default ProfileProxy;
