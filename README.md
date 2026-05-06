# rooman internship

AI-Powered Resume Builder with Role-Specific Content Suggestions

Full-stack app with a **React (Vite) + TypeScript** frontend, **Express + TypeScript** backend, **Firebase Authentication** and **Firestore** for per-user resumes, and **LLM-backed suggestions** (via the backend) using **Groq** and/or **OpenAI**. API keys never go to the browser.

## Project layout

- `frontend/` — SPA: auth, dashboard, editor, live preview, print/PDF
- `backend/` — REST API: verifies Firebase ID tokens, proxies AI requests
- Root `package.json` — runs lint/build across both packages

## Prerequisites

- Node.js 20+
- A [Firebase](https://console.firebase.google.com/) project with **Authentication** (Email/Password and optionally Google) and **Firestore** enabled
- At least one LLM API key: **[Groq](https://console.groq.com)** (free tier) and/or **[OpenAI](https://platform.openai.com)** (paid). If both `GROQ_API_KEY` and `OPENAI_API_KEY` are set, **Groq is used** unless you set `LLM_PROVIDER=openai`.

## Firebase setup

1. Create a web app in Firebase and copy the config into `frontend/.env` (see `frontend/.env.example`).
2. In Firestore, deploy rules from [`firestore.rules`](firestore.rules) (CLI: `firebase deploy --only firestore:rules` or paste in the console).
3. Create a **service account** key (Project settings → Service accounts) and set `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_JSON` in `backend/.env` so the API can verify ID tokens.

## Environment files

**Frontend** — copy `frontend/.env.example` → `frontend/.env`:

- All `VITE_FIREBASE_*` values from the Firebase console.
- `VITE_API_URL` — in **development**, you can leave this empty: the app uses same-origin `/api` and Vite proxies to the backend (`vite.config.ts`). For **production**, set this to your deployed API base URL (no trailing slash), e.g. `https://your-api.onrender.com`.

**Backend** — copy `backend/.env.example` → `backend/.env`:

- `GROQ_API_KEY` and/or `OPENAI_API_KEY` (see prerequisites for precedence).
- Optional: `GROQ_MODEL`, `OPENAI_MODEL`, `LLM_PROVIDER` (`groq` | `openai`), `OPENAI_RATE_LIMIT_RETRIES`.
- `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_JSON`.
- `FRONTEND_URL` — must match your frontend origin for CORS (default `http://localhost:5173` for local dev).

## Demo mode (no Firebase yet)

For `npm run dev`, you can use **`VITE_SKIP_AUTH=true`** (e.g. in `frontend/.env` or `frontend/.env.development`), which:

- Skips the login screen and opens the app as a demo user
- Stores resumes in **localStorage** (key `resume-studio-demo-resumes`) instead of Firestore
- Disables AI buttons until you use real Firebase auth + backend

To use real login and cloud saves, set `VITE_SKIP_AUTH=false` or remove it, add your `VITE_FIREBASE_*` keys to `.env`, and restart the dev server.

## Run locally

**Terminal 1 — backend**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — frontend**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API listens on **8787** by default (`PORT` in `backend/.env`).

With demo mode on, you land on the dashboard immediately; create a resume, **Save**, and **Print / PDF**. With Firebase configured and `VITE_SKIP_AUTH` off, register or sign in instead.

## Role-specific content suggestions (AI)

With the **backend running**, a **Groq or OpenAI key** set, and **real Firebase sign-in** (not demo mode), the editor shows AI suggestions. Each action shows a **preview** first; use **Apply to resume** (or **Add to skills** for keywords) or **Discard**.

| Action | API | What it does |
|--------|-----|----------------|
| Professional summary | `POST /api/suggestions/summary` | Target role, industry, optional JD, your skills as hints |
| Role focus | `POST /api/suggestions/role-focus` | Role-aligned positioning / focus lines |
| Core competencies | `POST /api/suggestions/core-competencies` | Competency bullets or phrases for the role |
| Skills list | `POST /api/suggestions/skills` | Replaces the skills list (preview → **Apply**) |
| Experience bullets | `POST /api/suggestions/bullets` | For the **selected** job card; role + JD + existing bullets |
| Education | `POST /api/suggestions/education` | Suggestions for education section copy |
| ATS keywords | `POST /api/suggestions/keywords` | Role/JD-aligned phrases; **Add to skills** merges without duplicates |

In dev, leave `VITE_API_URL` empty to use the Vite **proxy** from `/api` → `http://localhost:8787`. In production, set `VITE_API_URL` to your API base if it is not the same host.

If the provider returns HTTP **429**, wait before retrying; free Groq tiers have rate limits ([Groq console](https://console.groq.com)).

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| repo root | `npm run lint` | ESLint in `frontend` and `backend` |
| repo root | `npm run build` | Production builds for both |
| repo root | `npm run check` | `lint` then `build` |
| `frontend` | `npm run dev` | Vite dev server |
| `frontend` | `npm run build` | Production build |
| `frontend` | `npm run lint` | ESLint |
| `backend` | `npm run dev` | API with hot reload (`tsx watch`) |
| `backend` | `npm run build` | Compile to `dist/` |
| `backend` | `npm run lint` | ESLint |

## Firestore index

Listing resumes uses `orderBy('updatedAt', 'desc')`. If Firestore asks for a composite index, follow the link in the browser console or create a single-field index on `updatedAt` under the `resumes` subcollection scope.

## Deploy: Render (API) + Vercel (frontend)

Deploy order: **Render first** (get the public API URL), then **Vercel** (point the app at that API).

### 1. Render — backend

1. [render.com](https://render.com) → **New** → **Web Service** → connect your GitHub repo.
2. **Root directory:** `backend`
3. **Build command:** `npm install && npm run build`
4. **Start command:** `npm start`
5. **Instance type:** Free (API may sleep after idle time; first request can be slow).

**Environment variables** (Render → service → **Environment**):

| Key | Value |
|-----|--------|
| `FRONTEND_URL` | Your Vercel URL, e.g. `https://your-app.vercel.app` (set/update after step 2; then **Manual Deploy** so CORS picks it up) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Full JSON from Firebase → Project settings → Service accounts → Generate new private key (paste as one line or use Render’s multiline secret) |
| `GROQ_API_KEY` and/or `OPENAI_API_KEY` | Same as local `.env` for AI (optional: `LLM_PROVIDER`, model vars) |

Optional: `PORT` is set automatically by Render; do not override unless you know what you’re doing.

Copy the service URL, e.g. `https://rooman-api.onrender.com`.

### 2. Vercel — frontend

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import the same repo.
2. **Root directory:** `frontend`
3. Framework: Vite (auto). **Build command:** `npm run build`. **Output:** `dist`.
4. **Environment variables** (all **Production** — and Preview if you use preview deploys):

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://your-service.onrender.com` — **no trailing slash** |
| `VITE_FIREBASE_*` | Same as local `frontend/.env` |
| `VITE_SKIP_AUTH` | `false` or omit (do **not** use `true` in production) |

5. Deploy. Open the `.vercel.app` URL.

### 3. Wire CORS and Firebase

- In **Render**, set `FRONTEND_URL` to the **exact** Vercel URL (scheme + host, no path) and redeploy the API.
- In **Firebase Console** → Authentication → **Settings** → **Authorized domains**, add `your-project.vercel.app` (and your custom domain if you use one).

`frontend/vercel.json` adds SPA **rewrites** so React Router routes (e.g. `/dashboard`) work on refresh.

Optional: use repo-root `render.yaml` with **New → Blueprint** on Render to create the web service; you still add secrets in the dashboard.

## Security notes

- Never commit `.env` files or service account JSON.
- LLM API keys stay on the server; the client only sends a Firebase ID token with AI requests.
