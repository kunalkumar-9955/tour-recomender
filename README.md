# AI-Powered Tour Recommender

Production-style full-stack travel platform with collaborative filtering recommendations, JWT auth, review/rating flows, smart trip planner, and modern premium UI.

## Architecture

- `web/` - Next.js 14 + Tailwind + Framer Motion frontend
- `api/` - Express + MongoDB API (auth, destinations, reviews, admin stats, recommendation orchestration)
- `ml-service/` - FastAPI service for collaborative filtering and itinerary generation

## Features Included

- JWT auth with signup/login/forgot/reset password endpoints
- Destination search and listing
- Ratings/reviews with helpful likes
- Collaborative filtering recommendations with popular fallback
- Smart trip planner endpoint + frontend integration
- Dashboard cards + recommendation chart
- Premium visual style (glassmorphism, dark/light mode, motion)
- Mobile responsive layouts

## Quick Start

### 1) Install dependencies

```bash
npm install
npm install --workspace web
npm install --workspace api
```

### 2) Setup env files

- Copy `api/.env.example` to `api/.env`
- Copy `web/.env.example` to `web/.env.local`

### 3) Setup Python ML service

```bash
cd ml-service
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
```

### 4) Run all services

```bash
cd ..
npm run dev
```

Apps:

- Frontend: `http://localhost:3000`
- API: `http://localhost:5000/api/health`
- ML: `http://localhost:8000/health`

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/destinations?q=...`
- `POST /api/destinations`
- `POST /api/reviews` (auth)
- `GET /api/reviews/:destinationId`
- `POST /api/reviews/:id/helpful` (auth)
- `GET /api/recommendations/:userId`
- `GET /api/admin/stats`

## Recommendation Engine

The ML service creates a user-item matrix from ratings and computes user-user cosine similarity. It recommends unseen destinations favored by nearest neighbors. For cold-start users, it returns top-rated popular destinations.

## Production Hardening Checklist

- Replace in-memory password reset token store with Redis or DB TTL collection
- Add OAuth (Google) strategy
- Add RBAC middleware for admin routes
- Integrate weather/maps APIs (OpenWeather + Google Maps/Leaflet)
- Add booking redirection tracking, voice search, i18n, and PDF itinerary exports
- Add test suites (Jest + Supertest + Playwright)

