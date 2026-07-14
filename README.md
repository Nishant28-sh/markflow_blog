# MarkFlow — Premium Markdown Blog Editor

A full-stack markdown blog editor: split-pane live preview, syntax highlighting,
autosave, image uploads, and a dashboard — built with React + TypeScript on the
frontend and Express + MongoDB on the backend.

```
markflow/
├── frontend/   React 19 + Vite + TypeScript + Tailwind
└── backend/    Express + MongoDB (Mongoose) + JWT auth
```

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, Cloudinary keys
npm install
npm run dev             # http://localhost:5000
```

By default, the backend expects a local MongoDB instance at
mongodb://127.0.0.1:27017/markflow. If you prefer Atlas, replace MONGO_URI
with your cluster connection string. Without Cloudinary credentials, everything
works except image upload.

### 2. Frontend

```bash
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```

Register an account, and you're in.

## What's implemented

- **Auth** — JWT-based register/login, protected routes, persisted session
- **Dashboard** — live stat cards (total/drafts/published/word count), recent blogs
- **Editor** — resizable split-pane markdown editor + live preview, formatting
  toolbar, keyboard shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+/` for cheatsheet,
  `Ctrl+Shift+P` for fullscreen), autosave every 5s with a save-status indicator,
  paste/drag-and-drop image upload straight into the markdown
- **Preview** — GitHub Flavored Markdown, syntax-highlighted code blocks with
  copy buttons, tables, task lists
- **Blog management** — create, edit, delete, duplicate, publish, search,
  status filters (draft/published/archived), pagination
- **Design system** — dark glassmorphic UI on the palette/typography from the
  brief (Inter + JetBrains Mono, `#7C3AED` → `#3B82F6` gradient accents),
  reduced-motion support, visible focus states throughout

## Deliberately out of scope for this pass

To keep this a real, readable codebase rather than a wall of boilerplate, a
few "bonus" items from the original spec aren't wired up yet — they're
straightforward to add on this foundation:

- PDF export (Markdown/HTML export are trivial client-side additions; PDF
  needs a server-side render step)
- Rich-text underline via toolbar inserts raw `<u>` tags (Markdown itself has
  no native underline syntax)
- Table of contents generation and undo/redo history beyond the browser's
  native textarea undo
- Mobile tab-based editor/preview switch (currently the split pane scales
  down but doesn't collapse into tabs below a breakpoint)

## Architecture notes

- Backend errors flow through one `errorHandler` middleware; controllers just
  `throw new ApiError(status, message)`
- Frontend API calls are centralized in `src/services/*`, with a single axios
  instance handling the auth token and 401 redirects
- All blog stats (word count, reading time) are computed server-side on save
  via a Mongoose pre-save hook, so the numbers shown anywhere are always
  trustworthy
- Search uses MongoDB's text index (`title`, `content`, `tags`) rather than a
  separate endpoint — one `GET /api/blogs?search=` route covers both browsing
  and search
