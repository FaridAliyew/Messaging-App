# Messaging App (The Odin Project)

A full-stack real-time messaging application built as part of The Odin Project curriculum.

---

## Project Status

**Phase 1: Project Initialization and Architecture (Current)**
- React + Vite + TypeScript frontend setup with Tailwind CSS
- Node.js + Express + TypeScript backend architecture
- Routing, Axios, TanStack Query, and Health Check endpoint (`GET /api/health`) configured
- Clean separation of concerns with modular folder structures

---

## Project Structure

```text
MessagingApp/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application views/routes
│   │   ├── layouts/         # Layout wrappers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # Service modules
│   │   ├── lib/             # Axios and TanStack Query configs
│   │   ├── types/           # TypeScript interfaces & types
│   │   ├── App.tsx          # Router and root component
│   │   ├── main.tsx         # App entry point
│   │   └── index.css        # Tailwind CSS directives
│   ├── .env.example         # Frontend environment template
│   ├── index.html           # HTML template
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/          # Configurations (DB placeholder)
│   │   ├── controllers/     # Route controllers (healthController)
│   │   ├── middleware/      # Global middleware (error, 404)
│   │   ├── models/          # Database models (Phase 2)
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # Utility functions
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── .env.example         # Backend environment template
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

---

## Getting Started

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will be running at `http://localhost:5000`.
   Verify the health endpoint: `http://localhost:5000/api/health`.

### 2. Frontend Setup

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.

---

## Available Scripts

### Backend (`/backend`)
- `npm run dev`: Starts the development server with live reload via `tsx watch`.
- `npm run build`: Cleans `dist` and compiles TypeScript to JavaScript.
- `npm run start`: Runs compiled production code from `dist/server.js`.
- `npm run typecheck`: Runs `tsc --noEmit` to validate TypeScript without emitting files.

### Frontend (`/frontend`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Typechecks and bundles the application for production.
- `npm run preview`: Locally previews the production build.
- `npm run typecheck`: Runs `tsc --noEmit` to validate TypeScript without emitting files.

---

## Upcoming Phases

- **Phase 2**: MongoDB connection, Mongoose models, User Authentication (JWT, bcrypt), validation with Zod.
- **Phase 3**: User profiles, contacts, and friend requests.
- **Phase 4**: Conversations, messaging, and real-time communication (Socket.io).
