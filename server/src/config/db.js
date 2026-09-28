import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MONGODB_URI } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

let isConnected = false;

// In-memory / file fallback store
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      profiles: [],
      movies: [],
      tvshows: [],
      episodes: [],
      watchlists: [],
      watchhistories: [],
      playbacks: [],
      notifications: [],
      genres: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    const initialData = {
      users: [],
      profiles: [],
      movies: [],
      tvshows: [],
      episodes: [],
      watchlists: [],
      watchhistories: [],
      playbacks: [],
      notifications: [],
      genres: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

export const dbData = initDb();

export function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
  } catch (err) {
    console.error('Error saving local DB file:', err);
  }
}

export const isDbConnected = () => isConnected || mongoose.connection.readyState === 1;

export const dbConnect = async () => {
  const uri = process.env.MONGODB_URI || MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`Connected to MongoDB successfully: ${mongoose.connection.host || 'database'}`);
  } catch (error) {
    isConnected = false;
    console.warn(`MongoDB server connection notice (${error.message}). Using local database store.`);
  }
};

export class MockModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get collection() {
    if (!dbData[this.collectionName]) {
      dbData[this.collectionName] = [];
    }
    return dbData[this.collectionName];
  }

  async find(filter = {}) {
    let items = [...this.collection];
    if (Object.keys(filter).length > 0) {
      items = items.filter(item => {
        for (const key in filter) {
          if (filter[key] !== undefined && item[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      });
    }
    return items;
  }

  async findOne(filter = {}) {
    const items = await this.find(filter);
    return items[0] || null;
  }

  async findById(id) {
    const stringId = String(id);
    return this.collection.find(item => String(item.id) === stringId || String(item._id) === stringId) || null;
  }

  async create(data) {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = {
      id,
      _id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    this.collection.push(newItem);
    saveDb();
    return newItem;
  }

  async insertMany(items) {
    const created = [];
    for (const item of items) {
      created.push(await this.create(item));
    }
    return created;
  }

  async countDocuments(filter = {}) {
    const items = await this.find(filter);
    return items.length;
  }

  async findByIdAndUpdate(id, updateData) {
    const item = await this.findById(id);
    if (!item) return null;
    Object.assign(item, updateData, { updatedAt: new Date().toISOString() });
    saveDb();
    return item;
  }

  async deleteOne(filter) {
    const index = this.collection.findIndex(item => {
      for (const key in filter) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    });
    if (index > -1) {
      this.collection.splice(index, 1);
      saveDb();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(filter = {}) {
    let deletedCount = 0;
    if (Object.keys(filter).length === 0) {
      deletedCount = this.collection.length;
      dbData[this.collectionName] = [];
      saveDb();
      return { deletedCount };
    }
    dbData[this.collectionName] = this.collection.filter(item => {
      let matches = true;
      for (const key in filter) {
        if (item[key] !== filter[key]) matches = false;
      }
      if (matches) {
        deletedCount++;
        return false;
      }
      return true;
    });
    if (deletedCount > 0) saveDb();
    return { deletedCount };
  }
}
