import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { successResponse } from './utils/apiResponse.js';
import { dbConnect } from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import showRoutes from './routes/showRoutes.js';
import episodeRoutes from './routes/episodeRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import playbackRoutes from './routes/playbackRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';

// Seed
import { seedDatabase } from './seed/seedDatabase.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  return successResponse(res, null, 'Netflix Replica API is running');
});

// Mount API routes
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/playback', playbackRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Bootstrap Database and Seed Data
dbConnect().then(() => {
  seedDatabase();
}).catch(err => {
  console.error('Database connection error in bootstrap:', err);
});

export default app;
