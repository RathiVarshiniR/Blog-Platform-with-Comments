require("dotenv").config();
const express = require("express");
const cors = require("cors");

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in backend/.env");
  process.exit(1);
}

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const app = express();

const isAllowedOrigin = (origin) => (
  /^http:\/\/localhost:\d+$/.test(origin) ||
  /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
);

app.use(cors({
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Blog API is running",
    health: "/api/health",
    posts: "/api/posts",
  });
});

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// Server configuration
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "0.0.0.0"; // "0.0.0.0" allows external/Docker/cloud connections

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

// Error handling
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other server or set PORT to a different value.`);
  } else if (error.code === "EPERM") {
    console.error(`Cannot bind to ${HOST}:${PORT}. Try a different PORT or HOST in backend/.env.`);
  } else {
    console.error(error);
  }
  process.exit(1);
});
