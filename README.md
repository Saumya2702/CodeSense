# CodeSense – AI Code Reviewer for Students & Interns

CodeSense is an AI-powered code review platform designed to help students, interns, and beginner programmers understand *why* their code is weak, not just how to fix it.

---

## Monorepo Structure

- `frontend/` – Next.js + Clerk client app (App Router)
- `backend/` – Express + MongoDB API

---

## Quick Start

### 1) Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2) Configure environment

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Required values:

- Frontend
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_API_BASE_URL`
- Backend
  - `MONGO_URI`
  - `PORT` (optional, defaults to `5000`)

### 3) Run locally

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

---

## Current Features

- Code submission API with request validation
- Submission history endpoint by user
- Submission-backed review generation endpoint
- Clerk-protected frontend routes (`/submit`, `/dashboard`, `/history`, `/review/*`)
- App Router pages for landing, submit, dashboard, history, and review details

---

## Troubleshooting

- If backend exits immediately, confirm `backend/.env` has a valid `MONGO_URI`.
- If frontend cannot start, run `npm install` inside `frontend` and verify access to npm registry.
- Ensure `NEXT_PUBLIC_API_BASE_URL` points to your running backend (default `http://localhost:5000`).

---

## Deployment Notes

- Frontend: deploy to Vercel and set frontend env vars in project settings.
- Backend: deploy to Render (or similar) and set `MONGO_URI` and `PORT`.
- Ensure `NEXT_PUBLIC_API_BASE_URL` points to deployed backend URL.
