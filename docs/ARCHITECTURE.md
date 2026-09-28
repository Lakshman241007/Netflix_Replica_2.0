# Architecture Overview (Phase 1 – 10)

This document describes the architectural layout of the **Netflix Replica** established through Phase 10.

---

## 1. Recommendation & Notification Architecture (Phase 10)

Phase 10 delivers a transparent, explainable profile-based recommendation engine and a user/profile notification center:

```
Profile (Active Profile)
   │
   ├── Viewing Activity (Watch History) ───► Preferred Genres Frequency (+5 / +3)
   ├── My List (Watchlist) ────────────────► Watchlist Genre Signals (+3)
   ├── Catalog Popularity & Trends ────────► Global Signals (+2 / +1)
   │
   ▼
Scoring & Explainability Engine
   │ (Excludes already watched titles)
   ▼
Personalized "Recommended For You" Row
(e.g., "Because you watched Sci-Fi movies", "Popular right now")
```

### Notification Center Architecture:
- Broadcast & targeted notification storage with per-user/per-profile read receipts.
- Navbar header bell integration with real-time badge count, mark as read, and quick deep-linking to movie details.

---

## 2. Watch History & Continue Watching Architecture (Phase 8)

Phase 8 models how viewing activity is captured from playback sessions to produce the Netflix-style **Continue Watching** and **Watch History** experiences:

```
                 ┌──────────────┐
                 │    Movie     │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │   Playback   │
                 │ current      │
                 │ position     │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ WatchHistory │
                 │ viewing      │
                 │ activity     │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │  Continue    │
                 │  Watching    │
                 └──────────────┘
```

### Account vs Profile Resource Hierarchy:
```
User Account (Authentication / Credentials)
 │
 ├── Profile A
 │    ├── Watchlist
 │    ├── Playback (current playhead position)
 │    ├── WatchHistory (viewing activity log)
 │    └── Continue Watching (in-progress items)
 │
 └── Profile B
      ├── Watchlist
      ├── Playback
      ├── WatchHistory
      └── Continue Watching
```

### Key Distinctions:
1. **Playback**: Represents the authoritative resumable playhead position (position in seconds, duration, isPlaying).
2. **Watch History**: Represents the log of content the profile interacted with, timestamped with `watchedAt`.
3. **Continue Watching**: Filters movies that have started (`progress > 0%`) and are incomplete (`progress < 95%` and `completed !== true`), ordered by most recent activity (`watchedAt` descending).

---

## 2. Playback Architecture & Session Pipeline (Phase 7)

The playback system models how a streaming application manages video playback sessions, resumes viewing position, and syncs progress per user profile:

```
User (Account Authenticated)
  ↓
Active Profile (ProfileContext)
  ↓
Movie Details / Hero Banner (Play / Resume)
  ↓
GET /api/playback/:movieId (fetches saved progress)
  ↓
Video Player Fullscreen Session (/watch/:movieId)
  ↓
Periodic / Event-based Progress Sync:
  - Every 10s while playing
  - On pause
  - On seek
  - On exit
  POST / PUT /api/playback/:movieId
  ↓
Completion Check (≥95% duration or video ended):
  POST /api/playback/:movieId/complete
```

### Profile Isolation Guarantee in Playback:
- Just like the Watchlist, playback records are indexed by `{ profileId: 1, movieId: 1 }`.
- Profile A watching 15 minutes of Movie X does **NOT** alter Profile B's playback position for Movie X.
- The playback controller strictly verifies profile ownership against the authenticated user account before reading or updating playback state.

---

## 2. Watchlist / My List Architecture (Phase 6)

A central architectural requirement of Netflix and modern streaming systems is that **Watchlists belong to Profiles, not to Accounts**:

```
AUTHENTICATED USER ACCOUNT
       │ (Authentication identifies the account)
       ├── Profile A ("John")
       │      └── Watchlist: [ Movie 1, Movie 2 ]
       │
       ├── Profile B ("Kids")
       │      └── Watchlist: [ Animated Movie 3 ]
       │
       └── Profile C ("Guest")
              └── Watchlist: [ ]
```

### Authorization Flow:
```
Client Request (e.g. POST /api/watchlist)
  Headers:
    Authorization: Bearer <jwt_token>
    x-profile-id: <profileId>
  Body: { movieId: "..." }
         ↓
Express authMiddleware (`protect`)
  - Validates JWT signature
  - Attaches `req.user`
         ↓
Watchlist Controller (`addToWatchlist`)
  - Extracts `req.user.id` and active `profileId`
         ↓
Watchlist Service (`validateProfileOwnership`)
  - Queries `Profile.findOne({ _id: profileId, userId: req.user.id })`
  - Ensures the profile exists AND belongs to the requesting user
         ↓
Movie Validation & Duplicate Check
  - Verifies Movie exists in catalog
  - Enforces compound uniqueness (`profileId + movieId`)
         ↓
Database Mutation & Response
```

### Profile Isolation Guarantee:
- Profile A adding a movie has **zero effect** on Profile B.
- Switching profiles on the frontend triggers `useWatchlist` to reload the watchlist strictly for the newly active profile.
- Unauthenticated users and authenticated users without an active profile are gracefully prompted before any API call is made.

---

## 2. Search Pipeline Architecture (Phase 5)

```
SearchBar (/search)
     ↓
useDebounce (350ms delay)
     ↓
useSearch Hook (syncs with URL ?q=..., tracks active request ID)
     ↓
searchService.js -> Express -> MongoDB -> MovieCard Grid
```

---

## 3. Account vs. Profile Hierarchy (Phase 4)

- **Account**: User credentials, billing, role, primary identity.
- **Profiles**: Up to 5 household viewing contexts per account.

---

## 4. Global State & Layout Pipeline

```
AuthContext (user identity, JWT session)
     ↓
ProfileContext (activeProfile, profile list)
     ↓
useWatchlist (activeProfileId scoping, bookmark state)
     ↓
AppLayout (Navigation, Header, Footer)
     ↓
Pages: Home, Movies, MovieDetails, Search, MyList, Profiles, Account
```
