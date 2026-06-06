# 📝 Inkwell — Blog Platform with Comments

A full-stack blogging platform where users can register, write posts, and interact through comments.
Built with **React**, **Node.js/Express**, and **SQLite** as a hands-on full-stack learning project.

---

## 🌟 Features

- 🔐 User registration and login with JWT authentication
- ✍️ Create, edit, and delete blog posts (owner-only)
- 💬 Comment on posts and delete your own comments
- 🛡️ Protected routes — only logged-in users can write
- 🎨 Responsive editorial UI with a warm parchment aesthetic
- ⚡ RESTful API backend with SQLite (zero DB setup required)

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 | UI library |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend API |
| Vite | Dev server and build tool |

### Backend
| Tool | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express | REST API framework |
| SQLite (sqlite3) | Lightweight file-based database |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth tokens |
| dotenv | Environment variable loader |
| nodemon | Auto-restart on file changes (dev) |

---

## 📁 Project Structure
blog-platform/
├── backend/
│   ├── db/
│   │   └── database.js          # SQLite connection + table creation
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # /api/auth → register, login, me
│   │   ├── posts.js             # /api/posts → CRUD operations
│   │   └── comments.js          # /api/comments → add, delete
│   ├── .env                     # Environment variables (not committed)
│   ├── server.js                # Express app entry point
│   └── package.json
│
└── frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── axios.js         # Axios instance with auth interceptor
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── PostCard.jsx
│   │   └── CommentSection.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state via React Context
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── CreatePost.jsx
│   │   ├── EditPost.jsx
│   │   └── PostDetail.jsx
│   ├── App.jsx              # Routes + protected route logic
│   ├── main.jsx
│   └── index.css
├── .env                     # Environment variables (not committed)
└── package.json

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

> **Chromebook / Linux users:** Run this first to avoid native compilation errors:
> ```bash
> sudo apt-get update && sudo apt-get install -y build-essential python3
> ```

---

### 1. Clone the Repository

```bash
git clone https://github.com/RathiVarshiniR/Blog-Platform-with-Comments.git
cd Blog-Platform-with-Comments
```

---

### 2. Backend Setup

```bash
cd backend
npm install express sqlite3 bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

Create a `.env` file inside the `backend/` folder:
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

Start the backend:

```bash
npm run dev
```

Backend runs at: **http://localhost:5000**

---

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install react react-dom react-router-dom axios
npm install --save-dev vite @vitejs/plugin-react
```

Create a `.env` file inside the `frontend/` folder:
VITE_API_URL=http://localhost:5000/api

Start the frontend:

```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔌 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Create a new account |
| POST | `/login` | No | Login and receive JWT token |
| GET | `/me` | Yes | Get current logged-in user |

### Posts — `/api/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | No | Get all posts |
| GET | `/:id` | No | Get a single post |
| POST | `/` | Yes | Create a new post |
| PUT | `/:id` | Yes (owner) | Edit a post |
| DELETE | `/:id` | Yes (owner) | Delete a post |

### Comments — `/api/comments`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/:postId` | No | Get all comments for a post |
| POST | `/:postId` | Yes | Add a comment |
| DELETE | `/:commentId` | Yes (owner) | Delete a comment |

---

## 🔐 Authentication Flow

1. User registers or logs in via the API
2. Server returns a **JWT token** (valid for 7 days)
3. Token is stored in `localStorage`
4. Every protected request sends the token in the header:
Authorization: Bearer <token>
5. If the token is missing or expired → user is redirected to `/login`

---

## 🗃️ Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER | Primary key, auto-increment |
| username | TEXT | Unique |
| email | TEXT | Unique |
| password | TEXT | Hashed with bcryptjs |
| created_at | DATETIME | Auto timestamp |

### `posts`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER | Primary key, auto-increment |
| title | TEXT | Post title |
| content | TEXT | Post body |
| author_id | INTEGER | Foreign key → users.id |
| created_at | DATETIME | Auto timestamp |
| updated_at | DATETIME | Updated on edit |

### `comments`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER | Primary key, auto-increment |
| content | TEXT | Comment body |
| post_id | INTEGER | Foreign key → posts.id |
| author_id | INTEGER | Foreign key → users.id |
| created_at | DATETIME | Auto timestamp |

---

## 📌 Environment Variables

### `backend/.env`
| Variable | Description |
|---|---|
| PORT | Port for the Express server (default: 5000) |
| JWT_SECRET | Secret key for signing JWT tokens |

### `frontend/.env`
| Variable | Description |
|---|---|
| VITE_API_URL | Base URL of the backend API |

---

## 🧩 Concepts Covered

- Full-stack architecture — React frontend + Express backend + SQLite database
- RESTful API design and implementation
- JWT-based stateless authentication
- Password hashing with bcryptjs
- React Context API for global auth state
- Axios interceptors for automatic token injection
- Protected routes with React Router v6
- CORS setup for cross-origin communication
- Component-based UI design

---

## 📄 .gitignore

Make sure your `.gitignore` includes:
node_modules/
.env
backend/db/blog.db
dist/
.DS_Store

---

## 📝 Notes

- The SQLite database file `blog.db` is **auto-created** on first server start inside `backend/db/` — no manual setup needed.
- On Chromebook or restricted Linux environments, use the `sqlite3` package instead of `better-sqlite3` to avoid native C++ compilation errors.
- Never commit your `.env` files — they contain secrets.

---

## 👩‍💻 Author

**Rathi Varshini R**
Full-Stack Development — Learning Project
[GitHub](https://github.com/RathiVarshiniR)

---

## 📃 License

This project is open source and available under the [MIT License](LICENSE).
