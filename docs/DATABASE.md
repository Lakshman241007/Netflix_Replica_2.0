# Database Documentation (Phase 1 – 8)

This document describes the database design and schemas implemented through Phase 8.

---

## 1. Database Connection

- **ODM**: Mongoose (`mongoose`)
- **Connection Configuration**: Managed through `server/src/config/db.js`.
- **Environment Variable**: `MONGODB_URI`
- **Fallback**: In-memory/JSON fallback enabled when an external MongoDB daemon is not reachable.

---

## 2. Models

### `WatchHistory` Schema (`server/src/models/WatchHistory.js`)

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `ObjectId` | Yes | Reference to owning `User` (indexed) |
| `profileId` | `ObjectId` | Yes | Reference to owning `Profile` (indexed) |
| `movieId` | `ObjectId` | Yes | Reference to interacted `Movie` (indexed) |
| `position` | `Number` | No | Viewing position in seconds at time of interaction (default `0`) |
| `duration` | `Number` | No | Total video duration in seconds (default `0`) |
| `progress` | `Number` | No | Percentage watched `(position / duration) * 100` (`0`–`100`) |
| `completed` | `Boolean` | No | True if user finished title (default `false`) |
| `watchedAt` | `Date` | Auto | Timestamp of most recent viewing interaction (indexed) |
| `videoId` | `String` | No | Compatibility alias |
| `videoType` | `String` | No | Content type (`movie` or `tv`, default `movie`) |
| `createdAt` | `Date` | Auto | Record creation timestamp |
| `updatedAt` | `Date` | Auto | Record update timestamp |

**Indexes**:
- `{ profileId: 1, movieId: 1 }` (**Unique compound index**: ensures one consolidated viewing record per profile per movie)
- `{ profileId: 1, watchedAt: -1 }` (fast sorting for Continue Watching and History pagination)

---

### `Playback` Schema (`server/src/models/Playback.js`)

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `ObjectId` | Yes | Reference to owning `User` (indexed) |
| `profileId` | `ObjectId` | Yes | Reference to owning `Profile` (indexed) |
| `movieId` | `ObjectId` | Yes | Reference to playing `Movie` (indexed) |
| `position` | `Number` | No | Current playback position in seconds (default `0`) |
| `duration` | `Number` | No | Total video duration in seconds (default `0`) |
| `progress` | `Number` | No | Percentage progress calculated as `(position / duration) * 100` (`0`–`100`) |
| `isPlaying` | `Boolean` | No | True if playback session is currently active |
| `completed` | `Boolean` | No | True if title reached completion or ≥ 95% watched |
| `lastPlayedAt` | `Date` | Auto | Timestamp of last playback activity |
| `videoId` | `String` | No | Compatibility alias |
| `videoType` | `String` | No | Content type (`movie` or `tv`, default `movie`) |
| `createdAt` | `Date` | Auto | Session creation timestamp |
| `updatedAt` | `Date` | Auto | Session update timestamp |

**Indexes**:
- `{ profileId: 1, movieId: 1 }` (**Unique compound index**: ensures one independent playback record per profile per movie)

---

### `Watchlist` Schema (`server/src/models/Watchlist.js`)

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `ObjectId` | Yes | Reference to owning `User` (indexed) |
| `profileId` | `ObjectId` | Yes | Reference to owning `Profile` (indexed) |
| `movieId` | `ObjectId` | Yes | Reference to bookmarked `Movie` (indexed) |
| `videoId` | `String` | No | Compatibility alias |
| `videoType` | `String` | No | Media type (`movie` or `show`, default `movie`) |
| `createdAt` | `Date` | Auto | Timestamp of addition |
| `updatedAt` | `Date` | Auto | Timestamp of last modification |

**Indexes**:
- `{ profileId: 1, movieId: 1 }` (**Unique compound index**: ensures a profile cannot add the same movie more than once)

---

### `Profile` Schema (`server/src/models/Profile.js`)

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `ObjectId` | Yes | Reference to owning `User` document (indexed) |
| `name` | `String` | Yes | Profile display name (max 30 characters) |
| `avatar` | `String` | Yes | Predefined avatar URL |
| `avatarUrl` | `String` | No | Alias for backward compatibility |
| `isKids` | `Boolean`| No | Kids mode flag, default `false` |
| `createdAt`| `Date` | Auto | Creation timestamp |
| `updatedAt`| `Date` | Auto | Last update timestamp |

**Indexes**:
- `{ userId: 1, name: 1 }` (compound index for fast profile queries per account)

---

### `User` Schema (`server/src/models/User.js`)

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `String` | Yes | User display name |
| `email` | `String` | Yes (Unique) | User login email (lowercased) |
| `password` | `String` | Yes | Bcrypt-hashed password string |
| `role` | `String` | No | Account role (`user` or `admin`), default `user` |
| `subscriptionStatus` | `String` | No | Subscription simulation flag, default `active` |
| `createdAt` | `Date` | Auto | Timestamp of account creation |
| `updatedAt` | `Date` | Auto | Timestamp of last modification |

---

### `Movie` Schema (`server/src/models/Movie.js`)

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `String` | Yes | Title of the movie |
| `description` | `String` | Yes | Synopsis or summary |
| `poster` | `String` | No | URL to portrait poster |
| `backdrop` | `String` | No | URL to wide landscape backdrop |
| `releaseDate` | `String` | No | Release date in ISO or YYYY-MM-DD |
| `rating` | `String` | No | Age/content rating (e.g. `PG-13`, `R`, `PG`) |
| `duration` | `String` | No | Runtime string (e.g. `2h 18m`) |
| `genres` | `[String]`| No | Array of associated genres |
| `trailer` | `String` | No | Trailer video URL |
| `video` | `String` | No | Full stream video URL |
| `type` | `String` | No | Media type (`movie` or `tv`), default `movie` |
| `featured` | `Boolean`| No | Spotlighted on Hero Banner |
| `popularity`| `Number` | No | Score for popular/trending ordering (0–100) |

---

### `Genre` Schema (`server/src/models/Genre.js`)

| Field | Type | Required | Unique | Description |
|---|---|---|---|---|
| `name` | `String` | Yes | Yes | Display name (e.g. `Action`, `Sci-Fi`) |
| `slug` | `String` | Yes | Yes | URL-friendly slug (e.g. `action`, `sci-fi`) |
