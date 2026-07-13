---
name: GRID Project Setup
description: Architecture, stack, and key decisions for the GRID ML community site
---

## Architecture (current)
Pure React + Vite frontend — no backend server, no database, no API calls.

- **Port**: 5000 (single workflow: "Start application")
- **Data layer**: `client/src/data/store.js` — localStorage-backed store, seeded on first load
- **Auth**: localStorage-only; users under `grid_users`, session under `grid_session`
- **Workflow**: only "Start application" (`cd client && npm run dev`)

## What was removed
- `server/` directory (Express + PostgreSQL) — completely deleted
- "GRID API" workflow — removed
- Vite proxy config — removed from `vite.config.js`
- All `axios` imports across pages/components

## Data store keys (localStorage)
- `grid_users` — array of user objects
- `grid_session` — `{ username }` for current session
- `grid_blog_posts` — seeded with 6 ML articles
- `grid_forum_threads` — seeded with 7 threads
- `grid_forum_replies` — reply objects with thread_id

## Pages with store integration
- Blog, BlogPost, BlogEditor → `getBlogPosts`, `getBlogPost`, `createBlogPost`, `likeBlogPost`
- Forum, ForumThread, NewThreadModal → `getThreads`, `getThread`, `createThread`, `getReplies`, `createReply`, `upvoteThread`
- Dashboard → `getUserStats`, `getCommunityStats`
- Profile → `getUserByUsername`
- EditProfileModal → `updateUser` (via AuthContext `updateProfile`)
- Events, Home, Members, Projects → fully static (no store needed)

**Why:** User wanted to remove Express/PostgreSQL backend entirely to simplify deployment and eliminate server dependencies.

## Design system note
Primary theme: dark navy/black bg, cyan/blue/purple accents, Plus Jakarta Sans typography, `.glass-card`/`.premium-card`/`.tag`/`.input-field` utility classes (see `index.css`), `grid-cyan`/`grid-blue`/`grid-purple` Tailwind colors.
Forum/ForumThread pages were built earlier with a leftover "HUD" style (`font-orbitron`/`font-rajdhani` Tailwind fonts + default gray/orange/yellow Tailwind colors) that clashed with the primary theme — fixed by switching to the default Plus Jakarta Sans and theme rgba tones.
**Why:** worth checking other untouched pages/components for the same legacy-font/default-Tailwind-color drift before assuming they're already on-theme.
