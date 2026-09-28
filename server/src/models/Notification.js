import mongoose from 'mongoose';
import { MockModel } from '../config/db.js';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['new_release', 'recommendation', 'continue_watching', 'system', 'promotion'],
    default: 'system'
  },
  movieId: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: ''
  },
  read: {
    type: Boolean,
    default: false
  },
  readBy: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

const MongooseNotification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
const mockNotification = new MockModel('notifications');

function matchNotificationFilter(item, filter) {
  if (!item) return false;
  for (const key in filter) {
    if (key === '$or' && Array.isArray(filter.$or)) {
      const orMatched = filter.$or.some((subFilter) => matchNotificationFilter(item, subFilter));
      if (!orMatched) return false;
    } else if (key === '_id' || key === 'id') {
      const itemId = String(item._id || item.id || '');
      const filterId = String(filter[key]);
      if (itemId !== filterId) return false;
    } else if (key === 'profileId') {
      if (!filter.profileId) {
        if (item.profileId) return false;
      } else if (String(item.profileId) !== String(filter.profileId)) {
        return false;
      }
    } else if (key === 'userId') {
      if (!filter.userId) {
        if (item.userId) return false;
      } else if (String(item.userId) !== String(filter.userId)) {
        return false;
      }
    } else if (filter[key] !== undefined && item[key] !== filter[key]) {
      return false;
    }
  }
  return true;
}

class NotificationProxy {
  static get schema() {
    return notificationSchema;
  }

  static async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseNotification.find(filter).sort({ createdAt: -1 }).lean();
    }
    const all = await mockNotification.find({});
    return all.filter((item) => matchNotificationFilter(item, filter));
  }

  static async findOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseNotification.findOne(filter).lean();
    }
    const all = await mockNotification.find({});
    return all.find((item) => matchNotificationFilter(item, filter)) || null;
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseNotification.findById(id).lean();
    }
    return await mockNotification.findById(id);
  }

  static async create(data) {
    const payload = {
      ...data,
      read: data.read || false,
      readBy: data.readBy || [],
      createdAt: data.createdAt || new Date()
    };
    if (mongoose.connection.readyState === 1) {
      return await MongooseNotification.create(payload);
    }
    return await mockNotification.create(payload);
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseNotification.findByIdAndUpdate(id, update, { new: true, ...options }).lean();
    }
    return await mockNotification.findByIdAndUpdate(id, update);
  }

  static async updateMany(filter = {}, update = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseNotification.updateMany(filter, update);
    }
    const items = await this.find(filter);
    for (const item of items) {
      Object.assign(item, update);
    }
    return { modifiedCount: items.length };
  }

  static async deleteOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseNotification.deleteOne(filter);
    }
    const target = await this.findOne(filter);
    if (target) {
      return await mockNotification.deleteOne({ id: target.id || target._id });
    }
    return { deletedCount: 0 };
  }

  static async deleteMany(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseNotification.deleteMany(filter);
    }
    const itemsToDelete = await this.find(filter);
    for (const item of itemsToDelete) {
      await mockNotification.deleteOne({ id: item.id || item._id });
    }
    return { deletedCount: itemsToDelete.length };
  }

  static async countDocuments(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseNotification.countDocuments(filter);
    }
    const matches = await this.find(filter);
    return matches.length;
  }
}

export default NotificationProxy;
