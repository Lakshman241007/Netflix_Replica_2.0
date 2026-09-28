import { dbConnect } from '../config/db.js';
import Movie from '../models/Movie.js';
import Genre from '../models/Genre.js';
import TVShow from '../models/TVShow.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Notification from '../models/Notification.js';
import Subscription from '../models/Subscription.js';
import { hashPassword } from '../utils/hashPassword.js';
import { ALLOWED_AVATARS } from '../config/avatars.js';
import { seedGenres } from './genres.js';
import { seedMovies } from './movies.js';

export const seedDatabase = async ({ force = false } = {}) => {
  try {
    await dbConnect();

    // 1. Check Users & Profiles
    const userCount = await User.countDocuments();
    if (userCount === 0 || force) {
      const defaultPassword = await hashPassword('password123');
      await User.deleteMany({});
      await Profile.deleteMany({});

      const demoUser = await User.create({
        name: 'Demo User',
        email: 'user@netflix.com',
        password: defaultPassword,
        role: 'user',
        subscriptionStatus: 'active'
      });

      const demoAdmin = await User.create({
        name: 'Admin User',
        email: 'admin@netflix.com',
        password: defaultPassword,
        role: 'admin',
        subscriptionStatus: 'active'
      });

      // Create default profiles for demo accounts
      await Profile.create({
        userId: demoUser._id || demoUser.id,
        name: 'Demo User',
        avatar: ALLOWED_AVATARS[0],
        avatarUrl: ALLOWED_AVATARS[0],
        isKids: false
      });
      await Profile.create({
        userId: demoUser._id || demoUser.id,
        name: 'Kids',
        avatar: ALLOWED_AVATARS[5],
        avatarUrl: ALLOWED_AVATARS[5],
        isKids: true
      });

      await Profile.create({
        userId: demoAdmin._id || demoAdmin.id,
        name: 'Admin User',
        avatar: ALLOWED_AVATARS[1],
        avatarUrl: ALLOWED_AVATARS[1],
        isKids: false
      });

      // Seed initial subscriptions for demo accounts
      await Subscription.deleteMany({});
      await Subscription.create({
        userId: demoUser._id || demoUser.id,
        plan: 'Premium',
        status: 'active'
      });
      await Subscription.create({
        userId: demoAdmin._id || demoAdmin.id,
        plan: 'Premium',
        status: 'active'
      });

      console.log('✓ Seeded demo users, profiles, and active subscriptions (user@netflix.com / admin@netflix.com).');
    }

    // 2. Check Genres & Movies
    const movieCount = await Movie.countDocuments();
    if (movieCount < 15 || force) {
      console.log('Seeding database with full Phase 1 content catalog...');
      await Genre.deleteMany({});
      await Movie.deleteMany({});

      for (const genre of seedGenres) {
        await Genre.create(genre);
      }
      console.log(`✓ Seeded ${seedGenres.length} genres.`);

      for (const movie of seedMovies) {
        await Movie.create({
          ...movie,
          thumbnailUrl: movie.poster,
          videoUrl: movie.video,
          isFeatured: movie.featured
        });
      }
      console.log(`✓ Seeded ${seedMovies.length} movies.`);
    }

    // 3. Check TV Shows
    const showCount = await TVShow.countDocuments();
    if (showCount === 0 || force) {
      await TVShow.deleteMany({});
      await TVShow.create({
        title: 'Quantum Vanguard',
        description: 'A dedicated team of timeline navigators attempts to fix temporal fractures across the galaxy.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
        year: 2025,
        rating: 'TV-14',
        genres: ['Sci-Fi', 'Action'],
        cast: ['Elena Drake', 'Marcus Vance'],
        seasonsCount: 2
      });
      console.log('✓ Seeded TV Show foundation.');
    }

    // 4. Check Notifications
    const notifCount = await Notification.countDocuments();
    if (notifCount === 0 || force) {
      await Notification.deleteMany({});
      await Notification.create({
        title: 'New Arrival: Cyberpunk 2099',
        message: 'A neon-drenched sci-fi thriller is now streaming on Netflix.',
        type: 'new_release',
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      });
      await Notification.create({
        title: 'Top 10 Movies Today',
        message: 'Explore the most watched movies in your region right now.',
        type: 'recommendation',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 120)
      });
      await Notification.create({
        title: 'Welcome to Netflix Replica',
        message: 'Create multiple profiles, build your My List, and resume watching anytime.',
        type: 'system',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      });
      console.log('✓ Seeded initial notifications.');
    }

    console.log('Database seeding completed successfully.');
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
};

// If run directly via CLI
if (process.argv[1] && process.argv[1].endsWith('seedDatabase.js')) {
  seedDatabase({ force: true }).then(() => {
    console.log('Seed command finished.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seed command failed:', err);
    process.exit(1);
  });
}

export default seedDatabase;
