import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`).then(res => {
      if (res.data.author_id !== user?.id) navigate("/");
      setForm({ title: res.data.title, content: res.data.content });
    }).catch(() => navigate("/"));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.put(`/posts/${id}`, form);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally { setLoading(false); }
  };

  return (
    <main className="container" style={{ padding: "60px 24px", maxWidth: 720 }}>
      <h1 className="page-title">Edit Post</h1>
      <p className="page-subtitle">Update your story</p>

      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "36px" }}>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={10} required style={{ minHeight: 220 }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving…" : "Save Changes"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(`/posts/${id}`)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}