import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{
      background: "var(--ink)",
      borderBottom: "3px solid var(--gold)",
      position: "sticky", top: 0, zIndex: 100
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "16px 24px"
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "1.6rem",
            color: "var(--gold)", fontWeight: 700, fontStyle: "italic"
          }}>Inkwell</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user ? (
            <>
              <span style={{ color: "var(--gold-light)", fontSize: "0.85rem" }}>
                {user.username}
              </span>
              <Link to="/create" className="btn btn-gold" style={{ padding: "8px 18px", fontSize: "0.8rem" }}>
                + New Post
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{
                padding: "8px 18px", fontSize: "0.8rem",
                borderColor: "#4a3e2e", color: "var(--cream)"
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{
                padding: "8px 18px", fontSize: "0.8rem",
                borderColor: "#4a3e2e", color: "var(--cream)"
              }}>Login</Link>
              <Link to="/register" className="btn btn-gold" style={{ padding: "8px 18px", fontSize: "0.8rem" }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}