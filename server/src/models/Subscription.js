import mongoose from 'mongoose';
import { MockModel } from '../config/db.js';

export const SUBSCRIPTION_PLANS = {
  Basic: {
    name: 'Basic',
    plan: 'Basic',
    price: 8.99,
    billingPeriod: 'monthly',
    quality: 'HD',
    resolution: '720p / 1080p',
    screens: 1,
    downloads: 1,
    spatialAudio: false,
    ultraHd: false,
    description: 'Good video quality in HD. Watch on any phone, tablet, computer or TV.'
  },
  Standard: {
    name: 'Standard',
    plan: 'Standard',
    price: 13.99,
    billingPeriod: 'monthly',
    quality: 'Full HD',
    resolution: '1080p',
    screens: 2,
    downloads: 2,
    spatialAudio: false,
    ultraHd: false,
    description: 'Great video quality in Full HD (1080p). Watch on 2 supported devices at once.'
  },
  Premium: {
    name: 'Premium',
    plan: 'Premium',
    price: 17.99,
    billingPeriod: 'monthly',
    quality: 'Ultra HD (4K) + HDR',
    resolution: '4K (Ultra HD) + HDR',
    screens: 4,
    downloads: 6,
    spatialAudio: true,
    ultraHd: true,
    description: 'Best video quality in 4K Ultra HD and HDR with immersive Spatial Audio. Watch on 4 devices at once.'
  }
};

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  plan: {
    type: String,
    enum: ['Basic', 'Standard', 'Premium', 'none'],
    default: 'Standard'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'expired'],
    default: 'active',
    index: true
  },
  price: {
    type: Number,
    default: 13.99
  },
  billingPeriod: {
    type: String,
    default: 'monthly'
  },
  quality: {
    type: String,
    default: 'Full HD'
  },
  resolution: {
    type: String,
    default: '1080p'
  },
  screens: {
    type: Number,
    default: 2
  },
  downloads: {
    type: Number,
    default: 2
  },
  spatialAudio: {
    type: Boolean,
    default: false
  },
  ultraHd: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
}, {
  timestamps: true
});

const MongooseSubscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
const mockSubscription = new MockModel('subscriptions');

function matchFilter(item, filter) {
  if (!item) return false;
  for (const key in filter) {
    if (key === '_id' || key === 'id') {
      const itemId = String(item._id || item.id || '');
      const filterId = String(filter[key]);
      if (itemId !== filterId) return false;
    } else if (key === 'userId') {
      if (String(item.userId) !== String(filter.userId)) return false;
    } else if (filter[key] !== undefined && item[key] !== filter[key]) {
      return false;
    }
  }
  return true;
}

class SubscriptionProxy {
  static get schema() {
    return subscriptionSchema;
  }

  static async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSubscription.find(filter).lean();
    }
    const all = await mockSubscription.find({});
    return all.filter((item) => matchFilter(item, filter));
  }

  static async findOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSubscription.findOne(filter).lean();
    }
    const all = await mockSubscription.find({});
    return all.find((item) => matchFilter(item, filter)) || null;
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSubscription.findById(id).lean();
    }
    return await mockSubscription.findById(id);
  }

  static async create(data) {
    const planMeta = SUBSCRIPTION_PLANS[data.plan] || SUBSCRIPTION_PLANS.Standard;
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const payload = {
      userId: data.userId,
      plan: planMeta.name,
      status: data.status || 'active',
      price: planMeta.price,
      billingPeriod: planMeta.billingPeriod,
      quality: planMeta.quality,
      resolution: planMeta.resolution,
      screens: planMeta.screens,
      downloads: planMeta.downloads,
      spatialAudio: planMeta.spatialAudio,
      ultraHd: planMeta.ultraHd,
      startDate: data.startDate || now.toISOString(),
      endDate: data.endDate || expiry.toISOString(),
      expiresAt: data.expiresAt || expiry.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      return await MongooseSubscription.create(payload);
    }
    return await mockSubscription.create(payload);
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSubscription.findByIdAndUpdate(id, update, { new: true, ...options }).lean();
    }
    return await mockSubscription.findByIdAndUpdate(id, {
      ...update,
      updatedAt: new Date().toISOString()
    });
  }

  static async findOneAndUpdate(filter, update, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSubscription.findOneAndUpdate(filter, update, { new: true, ...options }).lean();
    }
    const target = await this.findOne(filter);
    if (!target) return null;
    return await mockSubscription.findByIdAndUpdate(target.id || target._id, {
      ...update,
      updatedAt: new Date().toISOString()
    });
  }

  static async deleteOne(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSubscription.deleteOne(filter);
    }
    const target = await this.findOne(filter);
    if (target) {
      return await mockSubscription.deleteOne({ id: target.id || target._id });
    }
    return { deletedCount: 0 };
  }

  static async countDocuments(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseSubscription.countDocuments(filter);
    }
    const matches = await this.find(filter);
    return matches.length;
  }
}

export default SubscriptionProxy;
