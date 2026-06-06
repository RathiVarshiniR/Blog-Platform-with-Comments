import { useState, useEffect } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/posts")
      .then(res => setPosts(res.data))
      .catch(() => setError("Could not load posts. Make sure the backend is running on port 5001."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container" style={{ padding: "60px 24px" }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{
          display: "inline-block", background: "var(--gold)",
          color: "white", fontSize: "0.7rem", fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "4px 12px", borderRadius: "2px", marginBottom: 12
        }}>
          Latest Stories
        </div>
        <h1 className="page-title">From the Inkwell</h1>
        <p className="page-subtitle">Thoughts, stories and ideas worth reading.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>
          Loading posts…
        </div>
      ) : error ? (
        <div className="error-msg" style={{ maxWidth: 620 }}>
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 0", color: "var(--muted)"
        }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 8 }}>
            No posts yet.
          </p>
          <p style={{ fontSize: "0.9rem" }}>Be the first to write something.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 24 }}>
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </main>
  );
}
