---
name: GRID Project Setup
description: Stack, run commands, secrets needed, and key components for the GRID Community platform
---

## Stack
- **Frontend**: React + Vite (port 5000) — `cd client && npm run dev`
- **Backend**: Express API (port 3001) — `node server/index.js`
- **DB**: PostgreSQL via `pg` driver; schema auto-inits on boot (`server/db/schema.js`)
- **Auth**: JWT — reads `JWT_SECRET` env var (`server/middleware/auth.js`)
- **Real-time**: WebSocket at `/ws` (same Express server, port 3001)

## Required secrets (not yet set)
- `DATABASE_URL` — PostgreSQL connection string; server starts but DB calls fail without it
- `JWT_SECRET` — for signing/verifying JWT tokens

## Install commands
- Root: `npm install` (concurrently, dotenv, express, pg, ws, jsonwebtoken, bcrypt…)
- Client: `cd client && npm install` (react, vite, framer-motion, tailwind, lucide-react, axios…)

## Key components
- `client/src/components/GridLogoAnimation.jsx` — ultra-premium animated logo (particle burst → build → forge text → data pulses → glitch → dissolve); phases driven by setTimeout chain; uses framer-motion + SVG
- `client/src/pages/Home.jsx` — renders `<GridLogoAnimation size={560} opacity={0.13} />` as background
- `client/src/App.jsx` — BrowserRouter + AuthProvider + ToastProvider + NotificationProvider

**Why:** The logo animation uses `position: relative` on the wrapper div so glitch RGB-split overlays (absolute-positioned) anchor correctly to the logo, not the viewport.
