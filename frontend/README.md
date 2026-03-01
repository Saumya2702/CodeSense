# CodeSense Frontend

Next.js frontend with Clerk authentication using the App Router.

## Setup

1. Install deps:

```bash
npm install
```

2. Configure env:

```bash
cp .env.example .env.local
```

3. Start dev server:

```bash
npm run dev
```

## Important environment variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

## App routes

- `/` – Landing page
- `/submit` – Submission editor
- `/dashboard` – Overview
- `/history` – Submission list
- `/review/[id]` – Review details
