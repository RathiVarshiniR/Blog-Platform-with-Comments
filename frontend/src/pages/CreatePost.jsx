import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/posts", form);
      navigate(`/posts/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally { setLoading(false); }
  };

  return (
    <main className="container" style={{ padding: "60px 24px", maxWidth: 720 }}>
      <h1 className="page-title">Write a Post</h1>
      <p className="page-subtitle">Share your story with the world</p>

      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "36px" }}>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="An interesting title…" required />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your post content here…" rows={10} required style={{ minHeight: 220 }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Publishing…" : "Publish Post"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}