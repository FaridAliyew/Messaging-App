# Forge — Messaging App

> A full-stack 1:1 messaging application built as the final project for [The Odin Project](https://www.theodinproject.com/lessons/nodejs-messaging-app) curriculum.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)

---

## Overview

Forge is a full-stack direct messaging application. Users can register, build a profile, browse other members, and exchange 1:1 messages in a two-pane chat interface. The backend exposes a REST API with JWT-based authentication via httpOnly cookies; the frontend polls for new messages at a short interval to approximate real-time delivery without WebSockets.

---

## Features

- **Authentication** — Register, log in, and log out with JWT stored in a secure httpOnly cookie (7-day expiry). Cookie is sent automatically on every API request.
- **User directory** — Browse and search all registered users by username or display name.
- **User profiles** — View any member's public profile (display name, @username, bio, avatar).
- **Profile editing** — Update your display name, bio, and avatar URL with a live avatar preview before saving.
- **1:1 Direct messaging** — Start a conversation from any user's profile page. Each pair of users has exactly one conversation (guaranteed atomically at the database level).
- **Two-pane chat UI** — Inbox list on the left, active thread on the right. Own messages appear right-aligned in amber; received messages appear left-aligned. Auto-scrolls to newest message.
- **Near real-time updates** — The active conversation thread refetches every 3 seconds so new messages from the other side appear automatically.
- **Warm dark theme** — A restrained editorial dark UI (Inter font, JetBrains Mono for metadata, amber accent) with no light mode.

---

## Screenshots

> **Login / Register**
> _Add screenshot here_

> **Users Directory**
> _Add screenshot here_

> **Chat (two-pane)**
> _Add screenshot here_

> **Profile / Edit Profile**
> _Add screenshot here_

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| TypeScript | Static typing |
| Tailwind CSS | Utility-first styling with custom dark token palette |
| React Router v6 | Client-side routing and protected routes |
| TanStack Query v5 | Server-state management, caching, polling |
| Axios | HTTP client with cookie-based auth |
| React Hook Form | Form state and submission handling |
| Zod | Schema validation (client-side + shared shapes) |
| lucide-react | SVG icon set |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 18+ | Runtime |
| Express | HTTP server and routing |
| TypeScript | Static typing |
| MongoDB + Mongoose | Document database and ODM |
| JSON Web Tokens (JWT) | Auth token generation and verification |
| bcryptjs | Password hashing |
| cookie-parser | httpOnly cookie handling |
| Zod | Request body validation |

---

## Project Structure

```text
MessagingApp/
├── frontend/
│   ├── index.html                  # HTML entry point (fonts, dark body bg)
│   ├── tailwind.config.js          # Custom dark token palette
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── App.tsx                 # Route definitions (public + protected)
│       ├── main.tsx                # React entry point
│       ├── index.css               # Base resets, scrollbar, focus ring
│       ├── components/
│       │   ├── Navbar.tsx          # Top navigation bar
│       │   ├── ProtectedRoute.tsx  # Auth guard
│       │   └── ui/                 # Reusable presentational primitives
│       │       ├── Avatar.tsx
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Spinner.tsx
│       │       └── TextArea.tsx
│       ├── context/
│       │   └── AuthContext.tsx     # Auth state (TanStack Query + mutations)
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useConversations.ts # Conversation + message hooks (polling)
│       │   └── useUsers.ts
│       ├── layouts/
│       │   └── AppLayout.tsx       # Navbar + main wrapper
│       ├── lib/
│       │   └── api.ts              # Axios instance (withCredentials)
│       ├── pages/
│       │   ├── ChatPage.tsx        # Two-pane messaging UI
│       │   ├── EditProfilePage.tsx
│       │   ├── HomePage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── UserProfilePage.tsx
│       │   └── UsersPage.tsx
│       ├── services/
│       │   ├── authService.ts
│       │   ├── conversationService.ts
│       │   └── userService.ts
│       └── types/
│           ├── conversation.ts
│           └── user.ts
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── app.ts                  # Express app setup (middleware, routes)
│       ├── server.ts               # HTTP server entry point
│       ├── config/
│       │   └── db.ts               # MongoDB Atlas connection
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── conversationController.ts
│       │   ├── healthController.ts
│       │   └── userController.ts
│       ├── middleware/
│       │   ├── authMiddleware.ts   # JWT cookie verification
│       │   └── errorMiddleware.ts
│       ├── models/
│       │   ├── Conversation.ts     # participantsKey unique index
│       │   ├── Message.ts          # compound index { conversation, createdAt }
│       │   └── User.ts
│       ├── routes/
│       │   ├── authRoutes.ts
│       │   ├── conversationRoutes.ts
│       │   ├── index.ts            # Route mounting
│       │   └── userRoutes.ts
│       ├── services/
│       ├── utils/
│       └── validators/
│           ├── authSchemas.ts
│           ├── messageSchemas.ts
│           └── userSchemas.ts
│
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A MongoDB Atlas cluster (free tier works fine)

### 1. Clone

```bash
git clone <your-repo-url>
cd MessagingApp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` from the template:

```bash
cp .env.example .env
```

Edit `.env` and fill in your own values (**never commit real secrets**):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-strong-random-secret-here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the dev server:

```bash
npm run dev
# Backend runs on http://localhost:5000
# Health check: GET http://localhost:5000/api/health
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` from the template:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Production Build

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build
# Serve the dist/ folder with any static host
```

---

## API Reference

### Auth — `/api/auth`

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new user; sets httpOnly cookie |
| `POST` | `/api/auth/login` | No | Log in; sets httpOnly cookie |
| `POST` | `/api/auth/logout` | Yes | Clear auth cookie |
| `GET` | `/api/auth/me` | Yes | Return the currently authenticated user |

### Users — `/api/users`

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/users` | Yes | List all users; supports `?search=` query param |
| `GET` | `/api/users/:id` | Yes | Get a single user's public profile |
| `PATCH` | `/api/users/me` | Yes | Update the current user's profile (displayName, bio, avatarUrl) |

### Conversations — `/api/conversations`

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/conversations` | Yes | Get or create a 1:1 conversation (atomic upsert; body: `{ recipientId }`) |
| `GET` | `/api/conversations` | Yes | List all conversations for the current user, sorted by latest activity |
| `GET` | `/api/conversations/:id/messages` | Yes | Get messages for a conversation (newest first, delivered chronologically; supports `?before=` ISO cursor, `?limit=`) |
| `POST` | `/api/conversations/:id/messages` | Yes | Send a message to a conversation (body: `{ content }`) |

---

## Architecture Notes

**REST-only, no WebSockets.** This was an intentional scope decision aligned with the assignment constraints. Real-time delivery is approximated by having the active conversation thread refetch on a 3-second interval (`refetchInterval: 3000` in TanStack Query). This means the recipient sees new messages within ~3 seconds of them being sent, without a persistent socket connection.

**Atomic conversation creation.** Each user pair has a stable sorted key (`participantsKey = [idA, idB].sort().join('_')`) with a unique index in MongoDB. `POST /api/conversations` uses `findOneAndUpdate` with `$setOnInsert` and `{ upsert: true }`, so concurrent requests from both sides never produce duplicate conversations.

**Cookie auth.** The JWT is stored in a `httpOnly`, `sameSite: lax`, `secure` (in production) cookie named `token`. Axios is configured with `withCredentials: true` so the cookie is sent on every API request automatically.

---

## Roadmap / Possible Improvements

- **Real-time delivery** — Replace polling with WebSocket / Socket.io for instant message delivery and typing indicators.
- **Image attachments** — Allow users to send images in messages (Cloudinary or S3 upload).
- **Friends list + online presence** — Friend request system and a live online indicator.
- **Group chats** — Multi-participant conversations (The Odin Project extra credit).
- **Message read receipts** — Mark messages as read; show unread counts in the inbox.
- **Push notifications** — Browser push API for background notifications.

---

## License

MIT
