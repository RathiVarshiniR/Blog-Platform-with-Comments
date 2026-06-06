import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontStyle: "italic", marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--muted)" }}>Sign in to your Inkwell account</p>
        </div>

        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "36px" }}>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.875rem", color: "var(--muted)" }}>
            No account?{" "}
            <Link to="/register" style={{ color: "var(--gold)", fontWeight: 500 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}