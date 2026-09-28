# Netflix Replica API Documentation (Phase 1 – 10)

This document covers all REST API endpoints implemented across Phase 1 (Content), Phase 2 (Browsing), Phase 3 (Authentication), Phase 4 (Profiles), Phase 5 (Search), Phase 6 (My List / Watchlist), Phase 7 (Playback), Phase 8 (Watch History & Continue Watching), and **Phase 10: Recommendation System & Notifications**.

---

## 1. Recommendations Endpoints (Phase 10)

All recommendation endpoints require authentication (`Authorization: Bearer <token>`) and active profile validation (`x-profile-id` header or `?profileId=...`).

### `GET /api/recommendations`
- **Description**: Generates explainable, profile-personalized content recommendations based on watch history genre frequency, watchlist preferences, popularity, and trending metrics.
- **Query Parameters**: `profileId` (optional if passed via header), `limit` (default 10).
- **Profile Isolation**: Strictly verifies profile ownership. Each profile receives independent recommendations tailored to its specific viewing patterns.
- **Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "64f1a2b...",
      "_id": "64f1a2b...",
      "title": "Cosmic Horizon",
      "poster": "https://...",
      "reason": "Because you watched Sci-Fi movies",
      "score": 9,
      "movie": {
        "id": "64f1a2b...",
        "title": "Cosmic Horizon",
        "description": "...",
        "rating": "PG-13"
      }
    }
  ],
  "message": "Recommendations retrieved successfully"
}
```

---

## 2. Notifications Endpoints (Phase 10)

### `GET /api/notifications`
- **Description**: Retrieves global announcements and user/profile-targeted notifications with unread counter.
- **Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "title": "New Arrival: Cyberpunk 2099",
      "message": "A neon-drenched sci-fi thriller is now streaming.",
      "type": "new_release",
      "imageUrl": "https://...",
      "read": false,
      "createdAt": "2026-09-28T09:30:00.000Z"
    }
  ],
  "unreadCount": 1
}
```

### `PATCH /api/notifications/:id/read`
- **Description**: Marks a specific notification as read for the active user/profile.

### `PATCH /api/notifications/read-all`
- **Description**: Marks all notifications as read for the active user/profile.

### `POST /api/notifications`
- **Description**: Creates a new notification (broadcast or targeted).

---

## Base URL
`/api`

---

## Response Format

### Successful Response
All successful responses return a JSON object with `success: true`:
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 1. Watch History & Continue Watching Endpoints (Phase 8)

All watch history endpoints require:
1. **User Authentication**: via Bearer token (`Authorization: Bearer <token>`).
2. **Active Profile Identification**: via header (`x-profile-id: <profileId>`), query (`?profileId=<profileId>`), or request body (`{ "profileId": "<profileId>" }`).

The backend strictly verifies that the active profile belongs to the authenticated account.

### `GET /api/history`
- **Description**: Returns the viewing activity list for the active profile, ordered with the newest activity first (`watchedAt` descending), with optional pagination (`page`, `limit`).
- **Query Parameters**: `page` (default 1), `limit` (default 20).
- **Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "64f1a2b...",
      "_id": "64f1a2b...",
      "movieId": "64f1a2b...",
      "position": 1200,
      "duration": 3600,
      "progress": 33.33,
      "completed": false,
      "watchedAt": "2026-09-28T09:30:00.000Z",
      "movie": {
        "id": "64f1a2b...",
        "_id": "64f1a2b...",
        "title": "Neon Odyssey",
        "poster": "https://images.unsplash.com/...",
        "backdrop": "https://images.unsplash.com/...",
        "rating": "PG-13",
        "duration": "2h 18m",
        "genres": ["Sci-Fi", "Action"]
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### `GET /api/history/continue-watching`
- **Description**: Returns movies that have meaningful incomplete viewing progress (`progress > 0` and `progress < 95%` and `completed !== true`), ordered by most recent viewing activity first.
- **Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "64f1a2b...",
      "movieId": "64f1a2b...",
      "title": "Neon Odyssey",
      "poster": "https://images.unsplash.com/...",
      "backdrop": "https://images.unsplash.com/...",
      "position": 1200,
      "duration": 3600,
      "progress": 33.33,
      "completed": false,
      "watchedAt": "2026-09-28T09:30:00.000Z"
    }
  ]
}
```

### `GET /api/history/:movieId`
- **Description**: Returns the viewing history record for a specific movie under the active profile.
- **Success (200)**: Single history item or 404 if not found.

### `POST /api/history/:movieId`
- **Description**: Creates or updates a viewing activity record.
- **Request Body**:
```json
{
  "position": 1200,
  "duration": 3600,
  "completed": false
}
```
- **Success (200)**: Returns the saved history record.

### `DELETE /api/history/:movieId`
- **Description**: Removes a single movie from the active profile's watch history.
- **Success (200)**: Returns `{ "success": true, "data": null }`.

### `DELETE /api/history`
- **Description**: Clears all watch history for the current active profile.
- **Success (200)**: Returns `{ "success": true, "data": null }`.

---

## 2. Playback System Endpoints (Phase 7)

All playback endpoints require:
1. **User Authentication**: via Bearer token (`Authorization: Bearer <token>`).
2. **Active Profile Identification**: via header (`x-profile-id: <profileId>`), query (`?profileId=<profileId>`), or request body (`{ "profileId": "<profileId>" }`).

The backend validates profile ownership (the profile must belong to the authenticated user's account) and movie existence before modifying playback records.

### `GET /api/playback/:movieId`
- **Description**: Retrieves current playback state (position, duration, progress percentage, completed status) for the active profile. Returns initial 0-position state if the title has not been played yet.
- **Success (200)**:
```json
{
  "success": true,
  "data": {
    "movieId": "64f1a2b...",
    "position": 120,
    "duration": 600,
    "progress": 20,
    "isPlaying": false,
    "completed": false,
    "lastPlayedAt": "2026-09-28T09:20:00.000Z"
  }
}
```

### `POST /api/playback/:movieId` or `PUT /api/playback/:movieId`
- **Description**: Records or updates playback progress (position in seconds, duration, isPlaying state). Automatically marks completed if progress is 95% or higher.
- **Request Body**:
```json
{
  "position": 120,
  "duration": 600,
  "isPlaying": true
}
```
- **Success (200)**: Returns the saved playback record.

### `POST /api/playback/:movieId/complete`
- **Description**: Marks the title as completely watched for the active profile (`progress: 100`, `completed: true`).
- **Success (200)**: Returns the completed playback record.

### `DELETE /api/playback/:movieId`
- **Description**: Resets/clears the playback record for the active profile on this title.
- **Success (200)**:
```json
{
  "success": true,
  "data": null,
  "message": "Playback state deleted successfully"
}
```

---

## 2. My List / Watchlist Endpoints (Phase 6)

All watchlist endpoints require:
1. **User Authentication**: via Bearer token (`Authorization: Bearer <token>`).
2. **Active Profile Identification**: via header (`x-profile-id: <profileId>`), query (`?profileId=<profileId>`), or request body (`{ "profileId": "<profileId>" }`).

The backend strictly verifies that the active profile exists and belongs to the authenticated user before executing any watchlist query or mutation.

### `GET /api/watchlist`
- **Description**: Returns all populated movies saved in the active profile's My List.
- **Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "64f1a2b...",
      "_id": "64f1a2b...",
      "title": "Interstellar",
      "description": "A team of explorers travel through a wormhole...",
      "poster": "https://images.unsplash.com/...",
      "backdrop": "https://images.unsplash.com/...",
      "rating": "PG-13",
      "duration": "2h 49m",
      "genres": ["Sci-Fi", "Drama", "Adventure"],
      "type": "movie",
      "addedAt": "2026-09-28T09:00:00.000Z"
    }
  ]
}
```
- **Error (400)**: `{ "success": false, "message": "Profile ID is required" }`
- **Error (403)**: `{ "success": false, "message": "Active profile not found or does not belong to your account" }`

---

### `POST /api/watchlist`
- **Description**: Adds a movie to the active profile's My List.
- **Request Body**:
```json
{
  "movieId": "64f1a2b..."
}
```
- **Rules**:
  - Movie must exist in the catalog.
  - Profile cannot add the same movie twice.
- **Success (201)**:
```json
{
  "success": true,
  "message": "Added to My List",
  "data": {
    "movieId": "64f1a2b...",
    "profileId": "64f1a2c..."
  }
}
```
- **Error (400)**: `{ "success": false, "message": "Movie already exists in My List" }`
- **Error (404)**: `{ "success": false, "message": "Movie not found" }`

---

### `DELETE /api/watchlist/:movieId`
- **Description**: Removes a movie from the active profile's My List.
- **Success (200)**:
```json
{
  "success": true,
  "message": "Removed from My List"
}
```
- **Error (404)**: `{ "success": false, "message": "Movie not found in My List" }`

---

### `GET /api/watchlist/check/:movieId`
- **Description**: Lightweight query checking whether a specific movie is currently bookmarked in the active profile's My List.
- **Success (200)**:
```json
{
  "success": true,
  "data": {
    "inWatchlist": true
  }
}
```

---

## 2. Search API (Phase 5)

- `GET /api/search?q=<query>`: Case-insensitive, partial-text search with pagination (`page`, `limit`), and optional filters (`genre`, `type`).

---

## 3. Profiles Endpoints (Phase 4)

- `GET /api/profiles`: List profiles belonging to authenticated user.
- `POST /api/profiles`: Create profile (max 5 per account).
- `GET /api/profiles/:id`: Retrieve single profile by ID.
- `PUT /api/profiles/:id`: Update profile (name, avatar, isKids).
- `DELETE /api/profiles/:id`: Delete profile (at least one profile must remain).

---

## 4. Authentication Endpoints (Phase 3)

- `POST /api/auth/register`: Registers a new account, generates default profile, returns signed JWT.
- `POST /api/auth/login`: Authenticates credentials and returns signed JWT.
- `GET /api/auth/me`: Retrieves current authenticated account details.
- `POST /api/auth/logout`: Clears session token cookie.

---

## 5. Content & Catalog Endpoints (Phase 1 & 2)

- `GET /api/health`: Health status.
- `GET /api/movies`: List movies with optional pagination and filters.
- `GET /api/movies/:id`: Retrieve single movie details.
- `GET /api/movies/featured`: Retrieve spotlight/featured movies for hero banner.
- `GET /api/movies/popular`: Retrieve movies ordered by popularity.
- `GET /api/movies/trending`: Retrieve movies ordered by release date.
- `GET /api/movies/genre/:genre`: Retrieve movies by category.
- `GET /api/genres`: List all genres.
- `GET /api/genres/:id`: Retrieve single genre.
