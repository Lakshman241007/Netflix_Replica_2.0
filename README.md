# 🎬 Netflix Replica — Full-Stack Streaming Platform

A full-stack **Netflix-inspired streaming platform** built to demonstrate modern frontend, backend, database, authentication, recommendation, notification, playback, and subscription workflows.

The project is developed as a complete monorepo containing a **React client application**, **React admin dashboard**, and **Express + MongoDB backend**.

> **Note:** This project is an independent educational implementation inspired by modern streaming-platform architecture. It is not affiliated with or endorsed by Netflix.

---

## 🌐 Live Demo

### 🚀 Deployed Application

**Live URL:**
`PASTE-YOUR-DEPLOYED-LINK-HERE`

### 🛠️ Admin Dashboard

**Admin URL:**
`PASTE-ADMIN-DEPLOYED-LINK-HERE`

---

## 📌 Project Overview

This project recreates the core experience of a modern streaming service while implementing the underlying full-stack architecture from scratch.

The application supports:

* User authentication and authorization
* Multiple user profiles
* Movie and TV-show browsing
* Search and filtering
* Movie details
* Video playback
* Continue Watching
* Watch History
* My List / Watchlist
* Personalized recommendations
* Notification center
* Subscription management
* Protected routes
* Admin content management
* Analytics dashboard
* MongoDB persistence
* RESTful API architecture

The system follows a modular architecture where the frontend communicates with the backend through REST APIs, while MongoDB handles persistent application data.

---

## ✨ Key Features

### 👤 Authentication & Profiles

* User registration and login
* JWT-based authentication
* Protected routes
* Password hashing
* Account management
* Multiple profiles per account
* Profile-specific viewing data
* Profile ownership validation

### 🎥 Streaming Experience

* Netflix-style home page
* Hero banner
* Movie and TV-show rows
* Movie detail pages
* Video player
* Playback progress tracking
* Resume watching functionality
* Continue Watching section
* Watch History

### ❤️ My List

Users can:

* Add movies to My List
* Remove movies from My List
* View their saved content
* Maintain separate watchlists for different profiles

Profile isolation ensures that one profile's watchlist does not affect another profile.

### 🔎 Search

The search system includes:

* Search bar
* Debounced requests
* URL-based search state
* Backend search API
* MongoDB movie search
* Search results displayed through reusable movie cards

### 🤖 Recommendations

The platform includes a profile-based recommendation system using signals such as:

* Watch History
* Preferred genres
* Watchlist activity
* Catalog popularity
* Trending signals

Recommendations are designed to be explainable, with signals such as:

> "Because you watched Sci-Fi movies"

and

> "Popular right now"

Already watched titles are excluded from recommendation results.

### 🔔 Notifications

The notification system provides:

* User/profile notifications
* Read/unread state
* Notification badge
* Notification dropdown
* Targeted notifications
* Deep links to relevant content

### 💳 Subscriptions

The application includes a subscription workflow with:

* Subscription page
* Subscription state
* Backend subscription model
* Subscription API
* Client-side subscription service

### 🛠️ Admin Dashboard

A separate administration application provides management interfaces for:

* Dashboard
* Movies
* TV Shows
* Users
* Analytics

The backend also includes admin authorization middleware to protect administrative operations.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      React Client    │
                         │   Vite + React 18    │
                         └──────────┬───────────┘
                                    │
                              REST API Calls
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Express Backend    │
                         │   Node.js + Express  │
                         └──────────┬───────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │ Controllers  │    │   Services   │    │ Middleware   │
        └──────────────┘    └──────────────┘    └──────────────┘
                │                   │
                └───────────────────┼───────────────────┘
                                    ▼
                         ┌──────────────────────┐
                         │       MongoDB        │
                         │      Mongoose        │
                         └──────────────────────┘


                         ┌──────────────────────┐
                         │   React Admin App    │
                         │   Vite + React 18    │
                         └──────────┬───────────┘
                                    │
                              REST API Calls
                                    │
                                    ▼
                              Express API
```

---

## 🧩 Project Structure

```text
netflix-replica/
│
├── client/                         # Main React application
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── utils/
│
├── admin/                          # Admin dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── vite.config.js
│
├── server/                         # Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   └── utils/
│   └── server.js
│
├── tests/                          # API and integration tests
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   └── SETUP.md
│
├── .env.example
├── package.json
└── README.md
```

---

## 🧠 Backend Architecture

The backend follows a modular layered architecture:

```text
Client
  │
  ▼
Routes
  │
  ▼
Middleware
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Mongoose Models
  │
  ▼
MongoDB
```

### Controllers

Controllers handle HTTP requests and responses.

Examples:

```text
authController.js
movieController.js
showController.js
profileController.js
watchlistController.js
historyController.js
playbackController.js
recommendationController.js
notificationController.js
subscriptionController.js
searchController.js
```

### Services

Business logic is separated into service modules:

```text
authService.js
movieService.js
profileService.js
watchlistService.js
historyService.js
playbackService.js
recommendationService.js
searchService.js
```

### Models

MongoDB data models include:

```text
User
Profile
Movie
TVShow
Episode
Genre
Watchlist
WatchHistory
Playback
Notification
Subscription
```

---

## 🔐 Authentication Flow

```text
User
 │
 ▼
Login / Register
 │
 ▼
Express Authentication API
 │
 ▼
Password Verification
 │
 ▼
JWT Generation
 │
 ▼
Authenticated Session
 │
 ▼
Protected API Routes
```

Authentication uses:

* JWT
* bcrypt
* HTTP cookies
* Express middleware
* Protected frontend routes

---

## 👥 Account & Profile Architecture

The project separates the **user account** from individual viewing profiles.

```text
User Account
│
├── Profile A
│   ├── Watchlist
│   ├── Watch History
│   ├── Playback
│   └── Recommendations
│
├── Profile B
│   ├── Watchlist
│   ├── Watch History
│   ├── Playback
│   └── Recommendations
│
└── Profile C
    ├── Watchlist
    ├── Watch History
    ├── Playback
    └── Recommendations
```

This allows each profile to maintain an independent viewing experience.

---

## ▶️ Playback & Continue Watching

Playback state is stored per profile and movie.

```text
Movie
  │
  ▼
Video Player
  │
  ▼
Playback Position
  │
  ▼
Watch History
  │
  ▼
Continue Watching
```

Playback progress can be synchronized during:

* Playback
* Pause
* Seek
* Exit
* Video completion

The application can resume a movie from its previously saved position.

---

## 🤖 Recommendation Pipeline

```text
Watch History ──────┐
                    │
Watchlist ──────────┤
                    ▼
              Genre Signals
                    │
                    ▼
           Popularity Signals
                    │
                    ▼
        Recommendation Engine
                    │
                    ▼
         Personalized Results
```

The recommendation system considers profile activity and catalog signals to generate personalized content.

---

## 🔔 Notification Pipeline

```text
Notification Event
        │
        ▼
Notification API
        │
        ▼
MongoDB
        │
        ▼
Authenticated Profile
        │
        ▼
Navbar Notification Center
```

Notifications support read/unread states and profile-aware delivery.

---

## 🛠️ Technology Stack

### Frontend

* React 18
* Vite
* React Router
* Tailwind CSS
* Lucide React
* JavaScript / JSX

### Backend

* Node.js
* Express.js
* REST APIs
* JWT
* bcrypt
* Multer
* CORS
* Cookie Parser

### Database

* MongoDB
* Mongoose

### Development

* npm Workspaces
* Vite
* ESLint
* Node Test Runner
* Git

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd netflix-replica
```

### 2. Install Dependencies

The project uses npm workspaces.

```bash
npm install
```

### 3. Configure Environment Variables

Create the required environment configuration using `.env.example`.

Example:

```env
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/netflix_replica

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
```

> Never commit real secrets, API keys, database credentials, or production environment variables to GitHub.

### 4. Seed the Database

```bash
npm run seed
```

### 5. Start the Application

```bash
npm run dev
```

The application can then be accessed through the configured development server.

---

## 🧪 Testing

Run the API test suite with:

```bash
npm test
```

The repository contains API and integration testing infrastructure under:

```text
tests/
├── api/
└── integration/
```

---

## 🏗️ Build

Build the frontend applications using:

```bash
npm run build
```

This builds both:

* Main Client
* Admin Dashboard

---

## 📚 Documentation

Additional technical documentation is available in the `docs/` directory:

| Document          | Description                               |
| ----------------- | ----------------------------------------- |
| `API.md`          | Backend API documentation                 |
| `ARCHITECTURE.md` | Application architecture and system flows |
| `DATABASE.md`     | Database models and relationships         |
| `SETUP.md`        | Local setup and execution instructions    |

---

## 🔄 Development Workflow

```text
User Interaction
       │
       ▼
React Component
       │
       ▼
Custom Hook / Service
       │
       ▼
REST API
       │
       ▼
Express Route
       │
       ▼
Controller
       │
       ▼
Service Layer
       │
       ▼
Mongoose Model
       │
       ▼
MongoDB
       │
       ▼
API Response
       │
       ▼
React State Update
       │
       ▼
Updated UI
```

---

## 📈 Project Development

The project was developed incrementally across multiple phases, starting from the core streaming interface and progressively adding backend functionality.

Major development areas include:

1. Project foundation
2. Authentication
3. User profiles
4. Movie and show catalog
5. Search
6. Watchlist / My List
7. Video playback
8. Watch History
9. Continue Watching
10. Recommendations
11. Notifications
12. Subscription workflow
13. Admin dashboard
14. Analytics
15. Testing and refinement

---

## 🎯 Learning Objectives

This project was developed as a practical full-stack learning project focused on understanding:

* Frontend and backend integration
* REST API development
* Authentication and authorization
* Database design
* MongoDB and Mongoose
* React component architecture
* State and context management
* Custom React hooks
* API service abstraction
* Profile-based data isolation
* Recommendation logic
* Playback state management
* Admin application architecture
* Testing
* Full-stack project organization

---

## 🚀 Future Improvements

Potential future enhancements include:

* Production-grade video streaming infrastructure
* Payment gateway integration
* Advanced recommendation models
* Real-time notifications
* Content delivery optimization
* Advanced analytics
* Automated CI/CD
* Cloud storage for media
* Improved accessibility
* Performance optimization
* Production monitoring and logging

---

## 📄 License

This project is intended for educational and development purposes.

All third-party trademarks, names, logos, and related intellectual property belong to their respective owners.

---

## 👨‍💻 Author

**Lakshman Mukesh L.**

Computer Science Engineering Student
Full-Stack Developer & Project Builder

---

## ⭐ Project Status

**Version:** `v1.0`
**Status:** Active Development / Completed V1 Feature Set

If you find the project useful or interesting, consider giving the repository a ⭐.
