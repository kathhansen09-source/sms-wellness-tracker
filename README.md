# SMS Wellness Content Tracker

A custom content capture and management app for SMS Wellness & Beauty.

## Features

- **Admin Dashboard** — Set weekly tasks, view all captured content, track monthly progress by content world
- **Team Capture Form** — Mobile-optimized form for team to upload content aligned with weekly tasks
- **Owner Dashboard** — Review and approve captured content, see monthly progress
- **Three Role-Based Interfaces** — Admin (strategist), Owner (client), Team (content capture staff)
- **Comments System** — Team can comment on their uploads; admin/owner can provide feedback

## Four Content Worlds

The strategy is organized around four distinct brand worlds:
1. **ATMOSPHERE** — Space, light, hands, calm (MIND pillar)
2. **TRANSFORMATION** — Before-afters as stories (SKIN pillar)
3. **AUTHORITY** — Education, the why (SKIN pillar)
4. **PEOPLE** — Therapists, reviews, connection (SOUL pillar)

## Access

- **Admin:** Email + password login (shared privately, not stored here)
- **Owner:** Email + password login
- **Team:** Team code (shared privately, not stored here)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

Deployed on Vercel. Push to GitHub → Vercel auto-deploys.

## Database

Uses Supabase for:
- Content captures (photos/videos)
- Weekly task prompts
- Comments
- Monthly targets

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Lucide React (icons)
- React Router (navigation)
