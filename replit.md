# GRID — Where Tech Minds Connect

## Overview
Premium tech community website with dark neon cyberpunk design matching the GRID logo (black background, electric blue/cyan glowing accents).

## Architecture
- **Frontend**: React + Vite (port 5000) — `client/` directory
- **Backend**: Express.js API (port 3001) — `server/` directory
- **Database**: PostgreSQL (Replit managed, `DATABASE_URL` env var)
- **Auth**: JWT tokens (stored in localStorage as `grid_token`)

## Pages (9 total)
1. `/` — Hero landing page with stats + latest blog posts
2. `/about` — Mission, vision, values, timeline, team
3. `/members` — Searchable/filterable member directory
4. `/events` — Hackathons, workshops, conferences
5. `/blog` — Technical articles by category
6. `/projects` — Open source projects showcase
7. `/forum` — Community discussion threads
8. `/login` — JWT login page
9. `/register` — Registration with role selector
10. `/dashboard` — Protected user dashboard

## Running
- **GRID API** workflow: `node server/index.js` → port 3001
- **Start application** workflow: `cd client && npm run dev` → port 5000

## Key Files
- `server/db/schema.js` — DB init + table creation (auto-runs on startup)
- `server/routes/auth.js` — Register/Login/Me endpoints
- `server/routes/community.js` — All community data endpoints
- `client/src/context/AuthContext.jsx` — JWT auth state

## User Preferences
- Ultra-premium dark neon design (black + electric blue #00d4ff + deep blue #0066ff + purple #7b2fff)
- Orbitron font for headings, Rajdhani for labels, Inter for body
- React-based multipage website with proper backend auth
