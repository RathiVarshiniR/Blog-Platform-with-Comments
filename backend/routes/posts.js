const express = require("express");
const db = require("../db/database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get all posts
router.get("/", (req, res) => {
  const posts = db.prepare(`
    SELECT p.*, u.username as author_name,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count
    FROM posts p
    JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
  `).all();
  res.json(posts);
});

// Get single post
router.get("/:id", (req, res) => {
  const post = db.prepare(`
    SELECT p.*, u.username as author_name
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// Create post
router.post("/", authenticateToken, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const result = db.prepare(
    "INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)"
  ).run(title, content, req.user.id);

  const post = db.prepare(`
    SELECT p.*, u.username as author_name
    FROM posts p JOIN users u ON p.author_id = u.id
    WHERE p.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(post);
});

// Update post
router.put("/:id", authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author_id !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

  db.prepare(
    "UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(title || post.title, content || post.content, req.params.id);

  const updated = db.prepare(`
    SELECT p.*, u.username as author_name
    FROM posts p JOIN users u ON p.author_id = u.id
    WHERE p.id = ?
  `).get(req.params.id);

  res.json(updated);
});

// Delete post
router.delete("/:id", authenticateToken, (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author_id !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

  db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
  res.json({ message: "Post deleted successfully" });
});

module.exports = router;