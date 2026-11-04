# Nackedei4All — Creator Studio
### *WordPress → GitHub Repos*

> **Live demo:** `npm run dev` → https://{preview}.e2b.app  
> **Original site:** [nackedei4all.wordpress.com](https://nackedei4all.wordpress.com) (WordPress.com)  
> **New repo:** [github.com/leibuseele-nackedei4all/nackedei4all](https://github.com/leibuseele-nackedei4all/nackedei4all)

A **full-stack, GitHub-inspired Creator Studio** that transforms the WordPress blog into a modern, polished workspace. Galleries become **repositories**, image sets become **files/commits**, the contact/booking form becomes a **kanban board**, and inquiries become **issue-like threads** — all with authentication, optimistic updates, and persistent storage.

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-4-orange)

---

## ✨ Why this transformation?

| WordPress concept | GitHub Studio concept |
|-------------------|------------------------|
| Page (`More Piczzz`, `Piczzz ohne Ende`, `Hier Daheim`) | **Repository** with README, topics, stars, forks, commits |
| Media library (400+ images) | **Files** inside repos, with history & previews |
| Comment/contact form (Tee trinken, Foto Session, Öl Massage…) | **Bookings kanban** (pending → confirmed → completed) |
| Comments / inquiries | **Inbox** threads (priority, replies, archive) |
| Followers / likes | **Stars & forks** + Insights analytics |
| WordPress login | **Auth** with demo accounts & 18+ age gate |

The WordPress site was a single-column blog with image dumps and an external link to `nackedei4u` via `ogy.de`. The Studio makes it **searchable, versioned, bookable, and creator-friendly** — like GitHub, but for body-positive art.

---

## 🎨 Features

### Authentication & Safety
- **Mock auth** (localStorage) with two demo personas: **Creator `zZinuZz`** (`studio@nackedei4all.de` / `demo123`) and **Guest** — no backend required
- **Register** any new fan account
- **18+ Age Gate** on first load (consent-first, artistic nudity notice, no explicit porn in demo)
- Protected routes, role-aware UI

### Dashboard
- Hero stats (stars, forks, views), pinned repos, recent activity feed, bookings & inbox previews
- Views chart (Recharts), booking funnel, language mix
- Quick actions: New repo, Browse, View bookings

### Repositories (Core Resource — Full CRUD)
- **List & grid** views, search, filter by visibility/language, sort by updated/stars/name
- **Pinned** repos in sidebar, archived/private badges
- **Create** (modal, slug auto-generated, topics, markdown README, validation)
- **Read** detail page with cover, README tab, Files tab (folder/file list + image previews), Commits history, Settings
- **Update** inline edit (name/description/README), visibility toggle, archive/unarchive, pin
- **Delete** with confirm
- **Star** (optimistic, count updates instantly), **Fork** (creates a copy), **Watch**
- **Empty / loading / skeleton** states throughout

### Bookings (Core Resource — Full CRUD)
- **Kanban + table** views, status filter (pending/confirmed/completed/cancelled)
- **Create** modal mapped from original WP form options: `Tee & Kuchen`, `Foto Session`, `Öl Massage`, `Private Session`, `Workshop`
- **Update** status via kanban buttons (Confirm → Complete → Cancel)
- **Delete** with confirmation
- Optimistic updates + toasts (sonner), avatar placeholders, relative dates

### Inbox / Messages (Core Resource — Full CRUD)
- **Split-pane** list + detail (Gmail/GitHub Issues style)
- **Search & filter** (open/closed/all), unread indicators, priority badges
- **Read/unread** sync on select, **reply** threads (owner badge), **archive/close/delete**
- **Create** new message, empty state

### Insights
- Views over time (line), top repos by stars (bar), language mix (pie), booking funnel
- Reconstructed from WP analytics → studio metrics

### Settings
- Profile edit (local), storage/workspace stats, **Reset demo data** & **Clear localStorage**
- Migration notes & safety statement

### UI Polish
- **GitHub dark theme** + warm accents (rose/amber/violet), `Space Grotesk` + `Inter` + `JetBrains Mono`
- **Responsive** sidebar → drawer on mobile, command palette (`⌘K`), top search
- **Empty states**, **loading skeletons**, **shimmer**, **optimistic updates** (instant UI + rollback simulation), **toasts**, **modals with backdrop blur**
- **Persistent storage** via `localStorage` (`n4a_store_v2` + `n4a_user` + `n4a_age_verified`) — survives reload, seeded on first load

---

## 🧱 Tech Stack

- **Frontend:** React 18, React Router 6, Zustand, Vite 5, TypeScript
- **Styling:** Tailwind CSS 3, custom dark palette (`#0a0a0f`, `#111119`, `#232330`), glass/backdrop blur
- **Icons:** lucide-react • **Charts:** Recharts • **Animations:** framer-motion • **Dates:** date-fns • **Toasts:** sonner
- **Storage:** localStorage (mock API with `simulateDelay` for realistic latency)
- **No backend required** — all CRUD is client-side with optimistic updates. Supabase-ready (see `lib/store.ts` for swap-in).

---

## 🚀 Quick Start

```bash
git clone https://github.com/leibuseele-nackedei4all/nackedei4all.git
cd nackedei4all
npm install
npm run dev       # → http://localhost:5173
npm run build     # → dist/
npm run preview   # → http://localhost:4173
```

### Demo Accounts

| Role | Email | Password | What you get |
|------|-------|----------|--------------|
| Creator (owner) | `studio@nackedei4all.de` | `demo123` (any works) | Full CRUD, pinned repos, bookings |
| Guest | `alex@example.com` | `demo123` | Explore, star, fork |

Or use the **“Demo creator” / “Guest explore”** buttons on `/login`.

> **First load:** you’ll see an **18+ age gate** — confirming artistic nudity notice. Accept to continue (stored in `localStorage`).

---

## 📁 Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── Layout.tsx        # Sidebar + topbar + command palette
│   │   ├── RepoCard.tsx      # Gallery card (GitHub-style)
│   │   └── ui.tsx            # Button, Card, Badge, EmptyState, Input…
│   ├── pages/
│   │   ├── Login.tsx         # Auth with demo buttons
│   │   ├── Dashboard.tsx      # Stats, pinned, activity
│   │   ├── Repos.tsx         # List/grid, filters, create modal
│   │   ├── RepoDetail.tsx    # README/files/commits/settings + CRUD
│   │   ├── Starred.tsx       # Favorites
│   │   ├── Bookings.tsx      # Kanban + table, full CRUD
│   │   ├── Inbox.tsx         # Split-pane messages, reply
│   │   ├── Insights.tsx      # Charts
│   │   └── Settings.tsx      # Profile, reset
│   ├── lib/
│   │   ├── store.ts          # Zustand + localStorage + optimistic CRUD
│   │   ├── seed.ts           # 12 repos, 7 bookings, 5 messages, activity
│   │   ├── auth.tsx          # Mock auth context + age gate
│   │   └── utils.ts          # cn, formatRelative, slugify, languageColors
│   ├── types/index.ts
│   ├── index.css
│   └── main.tsx              # Router + AgeGate + Protected
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🌱 Seed Data

On first load (or after **Reset demo data** in Settings), the app seeds:

- **12 repositories** — successors of WP pages: `Bodyscape Vol. III`, `More Piczzz Archive`, `Wald-Ritual`, `Studio Nude 001`, `Night Dance (Leib&Seele)`, `Polaroids 2024`, `VIP Lounge` (private), `Piczzz ohne Ende`, `Hier Daheim`, `Workshop`, `Sommersprossen`, `Nebel Morgen` (archived). Each has cover, topics, stars/forks/watchers, fileCount, README (markdown), commits.
- **7 bookings** — mapped from WP form: `Tee & Kuchen`, `Foto Session`, `Öl Massage`, `Private Session`, `Workshop` with pending/confirmed/completed/cancelled statuses.
- **5 messages** — inquiries about shoots, collabs, VIP access.
- **5 activity** items — stars, forks, commits, bookings.

All data persists in `localStorage` and is editable.

---

## 🔒 Content & Ethics

This is a **tasteful, artistic transformation**. No explicit pornographic images are generated or hosted. Demo covers use **Unsplash lifestyle/nature/studio placeholders** and gradients; text emphasizes **body-positivity, consent, and professionalism**. All fictional models are **18+**, booking copy is rewritten to be respectful (`Private Session` instead of explicit WP wording). The age gate and footer make this explicit.

Original WordPress content (adult) is **not copied verbatim** — galleries are reimagined as art repositories with proper licenses (`CC BY-NC 4.0`, `All rights reserved`, `Private`).

---

## 🔮 From Demo to Production (Supabase)

To add real persistence + auth:

1. Create a Supabase project.
2. Replace `lib/store.ts` localStorage with Supabase tables: `repos`, `bookings`, `messages`.
3. Replace `lib/auth.tsx` mock with `supabase.auth`.
4. In **Supabase → Auth → URL Configuration**, set Site URL to your GitHub Pages URL and allow redirects.
5. Deploy to **GitHub Pages**: `Settings → Pages → Deploy from branch → main → /root` → `https://leibuseele-nackedei4all.github.io/nackedei4all/`.

See `UndergroundZound` repo for a reference implementation of this pattern.

---

## 📸 Screenshots

> Run `npm run dev` to see: Login → Age Gate → Dashboard → Repositories (grid/list) → Repo Detail (README/Files/Commits) → Bookings (kanban) → Inbox (split-pane) → Insights → Settings.

All states are seeded — the app feels alive on first load.

---

## 📄 License

[CC0 1.0 Universal](./LICENSE) — same as the repository default. Demo images are Unsplash (free to use). Do not reuse model likenesses without consent.

---

**Built for** `leibuseele-nackedei4all/nackedei4all` • Koblenz, 2025 • *Where body is repository.*
