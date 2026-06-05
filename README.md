# Behavix

> A gamification dashboard for food waste reduction in university cafeterias.

Users log their cafeteria tray behaviour, earn points and streaks, and compete in department leaderboards. Managers get a separate analytics view with KPIs, AI-style advice and dish-level waste trends.

> Built by **Team 1** as part of a UX Challenge — prototype only.

<p align="center">
  <img src="public/logo-behavix.png" alt="Behavix logo" width="140" />
</p>

## Screenshots

> _Add screenshots/GIFs of the diner flow and the manager dashboard here._

## Tech stack

- **Frontend**: React 19 + TypeScript + Vite 6
- **Styling**: TailwindCSS v4 (`@tailwindcss/vite`)
- **Animations**: Motion (Framer Motion successor) + `canvas-confetti`
- **Icons**: `lucide-react`
- **Backend (BaaS)**: Firebase Auth (Google + Apple) + Cloud Firestore
- **Entry points**: two separate HTML pages — `index.html` (diner) and `manager.html` (canteen manager)

## Prerequisites

- Node.js ≥ 18
- A [Firebase](https://firebase.google.com/) project with Authentication and Firestore enabled

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Firebase project credentials (find them in the Firebase console under Project Settings → General → Your apps).

3. **Run locally:**
   ```bash
   npm run dev
   ```
   - Diner app: <http://localhost:3000/>
   - Manager dashboard: <http://localhost:3000/manager.html>

## Available scripts

| Script          | What it does                                  |
|-----------------|-----------------------------------------------|
| `npm run dev`   | Start the Vite dev server on port 3000        |
| `npm run build` | Build for production into `dist/`             |
| `npm run preview` | Serve the production build locally          |
| `npm run lint`  | Type-check the project with `tsc --noEmit`    |
| `npm run clean` | Remove the `dist/` build folder               |

## Firebase Security Rules

Make sure your Firestore Security Rules restrict read/write access appropriately before deploying. At minimum:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write only their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.token.email != null
                         && userId == request.auth.token.email.replace('.', '_').lower();
    }

    // Anyone authenticated can submit feedback; reads from client are blocked
    match /feedback/{docId} {
      allow create: if request.auth != null;
      allow read:   if false;
    }
  }
}
```

## Project structure

```
behavix/
├─ index.html               # Diner entry point
├─ manager.html             # Manager dashboard entry point
├─ public/                  # Static assets (logo, etc.)
├─ .github/workflows/       # CI (type-check + build on push/PR)
└─ src/
   ├─ main.tsx              # Diner React root
   ├─ manager.tsx           # Manager React root
   ├─ App.tsx               # Diner flow state machine
   ├─ types.ts              # Shared TypeScript types
   ├─ index.css             # Tailwind entry stylesheet
   ├─ views/                # Diner screens (10 ViewXxx components)
   ├─ manager/              # Manager feature (dashboard + sub-views + UI cards)
   ├─ components/           # Shared, reusable components
   ├─ data/                 # Mock datasets (dinerMock, managerMock)
   └─ lib/                  # Cross-cutting helpers (firebase.ts, utils.ts)
```

## Credits

Behavix was designed and built by **Team 1** during a UX Challenge as a prototype exploring how gamification can drive measurable food-waste reduction in university cafeterias.

## License

[MIT](LICENSE)
