import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch {}
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>Loading…</div>
  );
  if (!post) return null;

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
  const authorName = post.author_name || "Unknown author";

  return (
    <main className="container" style={{ padding: "60px 24px", maxWidth: 720 }}>
      <Link to="/" style={{ color: "var(--gold)", fontSize: "0.85rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 32 }}>
        ← Back to all posts
      </Link>

      <article>
        <header style={{ marginBottom: 36 }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "2.4rem",
            fontWeight: 700, lineHeight: 1.25, marginBottom: 16
          }}>{post.title}</h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "var(--gold)", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: "0.85rem"
              }}>
                {authorName[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{authorName}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{date}</div>
              </div>
            </div>

            {user?.id === post.author_id && (
              <div style={{ display: "flex", gap: 10 }}>
                <Link to={`/posts/${id}/edit`} className="btn btn-outline" style={{ padding: "7px 16px", fontSize: "0.8rem" }}>
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete
                </button>
              </div>
            )}
          </div>
        </header>

        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 32,
          fontSize: "1.05rem",
          lineHeight: 1.85,
          color: "#3d3326",
          whiteSpace: "pre-wrap"
        }}>
          {post.content}
        </div>
      </article>

      <div style={{ borderTop: "1px solid var(--border)", marginTop: 48 }} />
      <CommentSection postId={id} />
    </main>
  );
}
