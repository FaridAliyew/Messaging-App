# Messaging App (The Odin Project)

A full-stack real-time messaging application built as part of The Odin Project curriculum.

---

## Project Status

**Phase 4: Conversations + Messages (1:1 REST) (Completed)**
- Conversation model with atomic upsert and unique `participantsKey` (`models/Conversation.ts`)
- Message model with compound index on `{ conversation: 1, createdAt: 1 }` (`models/Message.ts`)
- Conversation endpoints: `POST /api/conversations` (atomic find-or-create), `GET /api/conversations` (inbox with latest message), `GET /api/conversations/:id/messages` (newest-first with ISO date cursor, delivered chronologically), `POST /api/conversations/:id/messages` (send message)
- Strict participant-based authorization returning `403 Forbidden` for non-participants
- Frontend conversation services (`conversationService.ts`) and TanStack Query hooks (`useConversations`, `useMessages`, `useSendMessage`, `useStartConversation`)
- Two-pane responsive Chat UI (`ChatPage.tsx`) with auto-scrolling message bubbles and light REST polling
- Profile direct messaging integration ("Message" button on `UserProfilePage.tsx`) and navigation link in `Navbar.tsx`


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
