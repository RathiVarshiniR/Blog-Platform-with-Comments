import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${postId}`);
      setComments(res.data);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post(`/comments/${postId}`, { content: newComment });
      setComments(prev => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {}
  };

  return (
    <section style={{ marginTop: 48 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 28
      }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>
          Comments
        </h3>
        <span style={{
          background: "var(--cream)", border: "1px solid var(--border)",
          borderRadius: "20px", padding: "2px 12px", fontSize: "0.8rem", color: "var(--muted)"
        }}>
          {comments.length}
        </span>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 36 }}>
          {error && <div className="error-msg">{error}</div>}
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            style={{ marginBottom: 12 }}
            rows={3}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Posting…" : "Post Comment"}
          </button>
        </form>
      ) : (
        <div style={{
          background: "var(--cream)", border: "1px solid var(--border)",
          borderRadius: "6px", padding: "20px 24px", marginBottom: 32,
          fontSize: "0.9rem", color: "var(--muted)"
        }}>
          <Link to="/login" style={{ color: "var(--gold)", fontWeight: 500 }}>Login</Link>
          {" "}or{" "}
          <Link to="/register" style={{ color: "var(--gold)", fontWeight: 500 }}>register</Link>
          {" "}to leave a comment.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {comments.length === 0 ? (
          <p style={{ color: "var(--muted)", fontStyle: "italic", fontSize: "0.95rem" }}>
            No comments yet. Be the first to respond.
          </p>
        ) : comments.map(comment => {
          const authorName = comment.author_name || "Unknown author";

          return (
          <div key={comment.id} style={{
            background: "var(--white)", border: "1px solid var(--border)",
            borderRadius: "6px", padding: "20px 24px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "var(--gold-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--ink)", fontSize: "0.7rem", fontWeight: 700
                }}>
                  {authorName[0].toUpperCase()}
                </div>
                <span style={{ fontWeight: 500, fontSize: "0.88rem" }}>{authorName}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                  · {new Date(comment.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              {user?.id === comment.author_id && (
                <button className="btn-danger btn" onClick={() => handleDelete(comment.id)}>
                  Delete
                </button>
              )}
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#4a3e2e" }}>
              {comment.content}
            </p>
          </div>
          );
        })}
      </div>
    </section>
  );
}
