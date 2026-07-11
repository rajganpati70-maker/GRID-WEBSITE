# GRID — Where ML Minds Connect

## Overview
Premium ML community website with dark neon cyberpunk design. Pure React frontend — no backend server, no database. All data is stored in the browser's localStorage.

## Architecture
- **Frontend only**: React + Vite (port 5000) — `client/` directory
- **Data layer**: `client/src/data/store.js` — localStorage-backed store with seed data
- **Auth**: localStorage-based (users stored under `grid_users`, session under `grid_session`)

## Data Store (`client/src/data/store.js`)
Central module that manages all app data in localStorage:
- **Users** — register/login/update profile; stored as JSON array under `grid_users`
- **Blog posts** — seeded with 6 articles; stored under `grid_blog_posts`
- **Forum threads** — seeded with 7 threads; stored under `grid_forum_threads`
- **Forum replies** — stored under `grid_forum_replies`

## Pages (10 total)
1. `/` — Hero landing page with stats + events preview
2. `/about` — Mission, vision, values, timeline, team
3. `/members` — Searchable/filterable member directory (static)
4. `/events` — Hackathons, workshops, conferences (static)
5. `/blog` — Technical articles by category (localStorage-backed)
6. `/projects` — Open source projects showcase (static)
7. `/forum` — Community discussion threads (localStorage-backed)
8. `/login` — localStorage-based login
9. `/register` — Registration with role selector
10. `/dashboard` — Protected user dashboard
11. `/profile/:username` — User profile page

## Running
- **Start application** workflow: `cd client && npm run dev` → port 5000

## User Preferences
- Ultra-premium dark neon design (black + electric blue #00d4ff + deep blue #0066ff + purple #7b2fff)
- Orbitron font for headings, Rajdhani for labels, Inter for body
- Pure frontend React app — no backend or database required
