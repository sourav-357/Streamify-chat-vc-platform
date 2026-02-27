# Chat & Video Calling Platform

A full‑stack language‑exchange application allowing users to sign up, chat, and initiate video calls. Built with React, Express, MongoDB, Tailwind CSS and Stream for real‑time communication. This repository contains separate `backend` and `frontend` projects with shared environment configuration.

---

## 🚀 High‑Level Features

- 🔐 JWT‑based authentication with protected routes
- 💬 Real‑time chat with typing indicators, message history, and media support
- 📹 Peer‑to‑peer video & audio calls (1‑on‑1 and group) including screen sharing and recording powered by Stream
- 👥 Friends system (search, friend requests, accept/reject/cancel, remove)
- 👤 User profiles (public view, edit own profile, change password, random avatar generation)
- 📂 Search users by name and browse recommendations
- 🎨 32+ UI themes via Tailwind/daisyUI with a lightweight theme store (Zustand)
- 🌐 Global state management with React context and hooks
- ⚡ Optimistic updates & caching with TanStack Query
- 🔧 Modular backend controllers, middleware, and routes
- ✅ Production build scripts and deployment-ready configuration

---

## 📁 Repository Structure

```
/                # root
  README.md      # this document
  package.json   # meta for monorepo if used
  /backend       # Express API server
    package.json
    src/
      controllers/
      models/
      routes/
      middleware/
      lib/
      server.js
  /frontend      # Vite + React application
    package.json
    src/
      components/
      pages/
      hooks/
      lib/
      constants/
      store/
    public/       # static assets
    index.html
```

> Both frontend and backend are independent npm projects. They can be deployed separately or together (backend serving static frontend in production).

---

## 📦 Prerequisites

- Node.js 18+ / npm
- MongoDB (local or Atlas)
- Stream API key/secret for chat & calls

---

## ⚙️ Configuration

### Environment Variables

Create `.env` files in each project folder.

#### Backend (`/backend/.env`)

```env
PORT=5001
MONGO_URI=your_mongo_connection_string
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

#### Frontend (`/frontend/.env`)

```env
VITE_STREAM_API_KEY=your_stream_api_key
VITE_API_BASE_URL=http://localhost:5001/api  # optional override
```

> **NOTE:** `VITE_` prefix is required for env variables used in the browser.

---

## 🛠 Development

### Backend

```bash
cd backend
npm install
npm run dev      # starts nodemon for hot reload
```

The API listens on `http://localhost:5001` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev      # starts Vite dev server (default http://localhost:5173)
```

Browse to `http://localhost:5173` and the frontend will proxy API calls to the backend (CORS is configured).

---

## 🧩 Key API Endpoints (Backend)

| Method | Path                                | Description                         |
|--------|-------------------------------------|-------------------------------------|
| POST   | `/api/auth/signup`                  | Create user                         |
| POST   | `/api/auth/login`                   | Authenticate                        |
| POST   | `/api/auth/logout`                  | Clear session cookie                |
| GET    | `/api/auth/me`                      | Return current user                 |
| PUT    | `/api/auth/me`                      | Update user profile                 |
| PUT    | `/api/auth/change-password`         | Change password                     |
| GET    | `/api/users/friends`                | Get friend list                     |
| GET    | `/api/users`                        | Get all recommended users           |
| POST   | `/api/users/friend-request/:id`     | Send friend request                 |
| GET    | `/api/users/outgoing-friend-requests` | List sent requests                |
| PUT    | `/api/users/friend-request/:id/accept` | Accept incoming request          |
| PUT    | `/api/users/friend-request/:id/reject` | Reject incoming request          |
| DELETE | `/api/users/friend-request/:id`     | Cancel outgoing request             |
| DELETE | `/api/users/friends/:id`            | Remove friend                       |
| GET    | `/api/users/search` (query `q=`)    | Search users by name                |
| GET    | `/api/chat/token`                   | Stream chat/call token              |

---

## 🧱 Frontend Highlights

- Routing with `react-router` (v7)
- React Query for asynchronous data fetching
- Custom hooks for auth flows (`useLogin`, `useLogout`, etc.)
- Components: `FriendCard`, `Navbar`, `Sidebar`, pages for chat, call, friends, notifications, profile, public profile, onboarding, login/signup.
- Utilities under `src/lib` (API wrapper, axios instance) and constants.
- Tailwind CSS + daisyUI for styling.
- Themes stored via Zustand (`useThemeStore.js`).

---

## ✅ Production Build & Deployment

### Frontend

```bash
cd frontend
npm run build   # outputs optimized files to /frontend/dist
```

You can deploy the `dist` directory to any static host (Netlify, Vercel, GitHub Pages, etc.).

### Backend + Serving Frontend

In production mode the backend serves the frontend build automatically: the server's `server.js` has

```js
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
```

So you can deploy both projects together on a single host (Heroku, Render, DigitalOcean App Platform, etc.).

#### Example Heroku Setup

1. Create a Heroku app with Node buildpack.
2. Set environment vars (`MONGO_URI`, `JWT_SECRET_KEY`, `STREAM_API_KEY`, `STREAM_API_SECRET`).
3. In the root `package.json`, add a `start` script that bootstraps the backend:

   ```json
   "scripts": {
     "start": "cd backend && npm run start"
   }
   ```

4. Ensure the backend `start` script runs `node src/server.js`.
5. Push to Heroku; the frontend will be built during the backend build step if you add a preinstall script or handle it in a `heroku-postbuild` hook.

Alternatively, deploy frontend and backend separately and configure the frontend to use the backend’s URL via `VITE_API_BASE_URL`.

---

## 🛡 Security & Best Practices

- Store secrets in environment variables, never commit keys.
- Use HTTPS in production; configure CORS allowed origins.
- Use `helmet` and rate limiting for the API (can be added to `backend/src/middleware`).
- Validate and sanitize incoming data (Mongoose schemas already enforce types, but additional checks can be added).

---

## 🧩 Extending the App

- Add group chat rooms or channels (Stream supports this via channels).
- Integrate file uploads using S3/Cloudinary.
- Implement push notifications for friend requests and messages.
- Add localization support for UI strings.

---

## 💬 Support

This project is intended as a learning/reference implementation. For questions or contributions, please open an issue or submit a pull request.

---

**Happy coding!** 🎉

