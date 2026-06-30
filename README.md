# SkillTrack Pro

A production-style full-stack MERN application for tracking skills, projects, certifications, and learning goals — built as a portfolio piece to demonstrate real-world engineering practices, not just basic CRUD.

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Context API, Recharts, react-hot-toast
**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT auth, bcrypt, express-validator, Multer, Helmet

## 1. Architecture

```
Browser (React SPA)
   │  Axios (JWT in Authorization header)
   ▼
Express REST API
   │  Mongoose ODM
   ▼
MongoDB
```

The backend follows a layered structure: **routes → middleware → controllers → models**. Routes only wire HTTP verbs to controllers and declare validation rules; controllers contain business logic; models own schema and data rules (e.g. password hashing lives in the User model via a pre-save hook, not scattered across controllers). This separation means a recruiter can open any single file and immediately understand its responsibility — a key signal of code maturity.

The frontend follows **pages → components → hooks/services → context**. Pages compose feature components and own page-level state (filters, pagination, modal open/close). Components are presentational and reusable. The `services/` layer is the only place that talks to Axios — components never call `axios` directly, which makes swapping REST for GraphQL, or mocking for tests, a one-file change.

### Why Context API instead of Redux Toolkit
For an app this size (two pieces of global state: auth and theme), Redux Toolkit would add boilerplate without payoff. Context + hooks keeps the codebase lean and easier to read in an interview — while still demonstrating proper separation of global vs. local state, which is the actual skill being evaluated.

### Why JWT (stateless) over sessions
JWT lets the API stay completely stateless, which is what you want when you may eventually deploy frontend and backend on different domains/services (Vercel + Render, for example) — no shared session store needed, and it scales horizontally without sticky sessions.

## 2. Database Schema Design

| Model | Key Fields | Relationships |
|---|---|---|
| **User** | name, email (unique), password (hashed), role (`user`/`admin`), avatarUrl, bio | referenced by all other models via `user` |
| **Skill** | name, category, proficiency (0–100), level, notes | belongs to User; referenced by Project & Goal |
| **Project** | title, description, techStack[], repoUrl, liveUrl, status | belongs to User; references Skill[] |
| **Certification** | title, issuer, issueDate, expiryDate, fileUrl | belongs to User |
| **Goal** | title, progress (0–100), status, targetDate | belongs to User; references one Skill |

Every child document stores a `user` ObjectId and every query is scoped with `{ user: req.user.id }` at the controller level — this is the data-isolation pattern that prevents one user from ever seeing another's data, enforced consistently rather than relying on the frontend.

## 3. Security Practices Implemented

- Passwords hashed with bcrypt (cost factor 10), never returned in API responses (`select: false`)
- JWT signed with a server-only secret, verified on every protected request
- `helmet()` for secure HTTP headers
- `express-mongo-sanitize()` to strip NoSQL injection operators (`$`, `.`) from input
- Rate limiting on `/api/auth/*` to slow brute-force attempts
- express-validator on every write endpoint — bad input never reaches the database layer
- Centralized error handler normalizes Mongoose/JWT errors into a consistent JSON shape and hides stack traces in production
- File uploads restricted by MIME type and size (5MB) via Multer
- Role-based authorization middleware (`authorize('admin')`) guards admin routes

## 4. Project Structure

```
skilltrack-pro/
├── server/
│   ├── config/db.js
│   ├── controllers/        # business logic
│   ├── middleware/         # auth, validation, error handling, upload
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── utils/generateToken.js
│   ├── seed.js             # demo data seeder
│   ├── app.js               # Express app (middleware + routes)
│   └── server.js            # entry point
└── client/
    └── src/
        ├── components/      # reusable UI, grouped by feature
        ├── context/         # AuthContext, ThemeContext
        ├── hooks/           # useFetch, useDebounce
        ├── layouts/         # DashboardLayout, AuthLayout
        ├── pages/           # route-level components
        └── services/        # Axios API layer (one file per resource)
```

## 5. Local Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### Backend
```bash
cd server
cp .env.example .env     # edit MONGO_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000
```

Optional — seed demo data (admin + demo user with sample skills/projects):
```bash
node seed.js
```
This creates:
- `admin@skilltrack.dev` / `admin123` (role: admin)
- `demo@skilltrack.dev` / `demo1234` (role: user, with sample data)

### Frontend
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

Vite proxies `/api` and `/uploads` to `localhost:5000` in development, so no CORS config is needed locally (see `vite.config.js`).

## 6. Deployment Guide

**Backend (Render / Railway / Fly.io):**
1. Push `server/` to a Git repo (or the whole monorepo with a root directory setting).
2. Set environment variables: `MONGO_URI` (Atlas), `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (your deployed frontend URL), `NODE_ENV=production`.
3. Build command: `npm install`. Start command: `npm start`.
4. Note: the `uploads/` folder is local disk storage — fine for a portfolio demo, but on most PaaS platforms disk is ephemeral. For production-grade persistence, swap `multer.diskStorage` for `multer-storage-cloudinary` or an S3 storage engine (the upload middleware is isolated in `middleware/upload.js` specifically so this swap touches one file).

**Frontend (Vercel / Netlify):**
1. Set the project root to `client/`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Set `VITE_API_URL` to your deployed backend URL and update `src/services/api.js`'s `baseURL` to use it (currently relies on the dev proxy; in production point Axios directly at the API origin, e.g. `baseURL: import.meta.env.VITE_API_URL`).
4. Update the backend's `CLIENT_URL` env var to match this deployed frontend origin so CORS allows it.

**Database (MongoDB Atlas):**
1. Create a free M0 cluster, add a database user, and allow network access from your backend host (or `0.0.0.0/0` for simplicity in a portfolio project).
2. Use the provided connection string as `MONGO_URI`.

## 7. What to Highlight to Recruiters

- Full auth flow including forgot/reset password with hashed reset tokens
- Role-based authorization, not just "is logged in" checks
- Scoped, multi-tenant data access (every query filtered by the authenticated user)
- A real API service layer + custom hooks rather than fetch calls scattered through components
- Dark mode, responsive layout, loading/empty/error states handled explicitly everywhere
- Search, filtering, and server-side pagination on every list endpoint
- Centralized error handling and input validation/sanitization on the backend
