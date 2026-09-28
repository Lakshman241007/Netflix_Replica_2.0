# Setup and Execution Guide (Phase 1 – 3)

This guide walks through configuring and running the **Netflix Replica** locally.

---

## 1. Environment Variables

Create a `.env` file at the root of the project with the following keys:

```bash
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/netflix_replica
JWT_SECRET=netflix_replica_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

---

## 2. Installation

Install all project dependencies across the workspace:

```bash
npm install
```

---

## 3. Database Seeding

Populate the database with the initial movies, genres, and demo users:

```bash
npm run seed
```

### Pre-seeded Demo Accounts:
- **Standard User**: `user@netflix.com` / `password123`
- **Admin User**: `admin@netflix.com` / `password123`

---

## 4. Running Tests

Run the automated test suite verifying all Phase 1, 2, and 3 endpoints:

```bash
npm test
```

---

## 5. Development Server

Start the full-stack server (serving both the Express API and the React Vite client on port 3000):

```bash
npm run dev
```

Visit the app in your browser at `http://localhost:3000`.
