const express = require("express");
const db = require("../db/database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get comments for a post
router.get("/:postId", (req, res) => {
  const comments = db.prepare(`
    SELECT c.*, u.username as author_name
    FROM comments c
    JOIN users u ON c.author_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `).all(req.params.postId);
  res.json(comments);
});

// Add comment
router.post("/:postId", authenticateToken, (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "Comment content required" });

  const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const result = db.prepare(
    "INSERT INTO comments (content, post_id, author_id) VALUES (?, ?, ?)"
  ).run(content, req.params.postId, req.user.id);

  const comment = db.prepare(`
    SELECT c.*, u.username as author_name
    FROM comments c JOIN users u ON c.author_id = u.id
    WHERE c.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(comment);
});

// Delete comment
router.delete("/:commentId", authenticateToken, (req, res) => {
  const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(req.params.commentId);

  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author_id !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

  db.prepare("DELETE FROM comments WHERE id = ?").run(req.params.commentId);
  res.json({ message: "Comment deleted" });
});

module.exports = router;