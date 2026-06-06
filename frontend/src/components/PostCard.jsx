import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const authorName = post.author_name || "Unknown author";
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  const content = post.content || "";
  const excerpt = content.length > 160
    ? content.slice(0, 160) + "…"
    : content;

  return (
    <article style={{
      background: "var(--white)",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      padding: "32px",
      transition: "box-shadow 0.2s, transform 0.2s",
      cursor: "pointer",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "var(--gold)", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "white", fontSize: "0.75rem", fontWeight: 700
        }}>
          {authorName[0].toUpperCase()}
        </div>
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{authorName}</span>
        <span style={{ color: "var(--border)" }}>·</span>
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{date}</span>
      </div>

      <Link to={`/posts/${post.id}`}>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "1.45rem",
          fontWeight: 700, marginBottom: 10, lineHeight: 1.3,
          color: "var(--ink)"
        }}>{post.title}</h2>
      </Link>

      <p style={{ color: "#5a4e3c", lineHeight: 1.7, marginBottom: 20, fontSize: "0.95rem" }}>
        {excerpt}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to={`/posts/${post.id}`} style={{
          fontSize: "0.82rem", color: "var(--gold)",
          fontWeight: 500, letterSpacing: "0.04em",
          textTransform: "uppercase"
        }}>
          Read more →
        </Link>
        <span style={{
          fontSize: "0.78rem", color: "var(--muted)",
          background: "var(--cream)", padding: "4px 10px",
          borderRadius: "20px"
        }}>
          💬 {post.comment_count} comment{post.comment_count !== 1 ? "s" : ""}
        </span>
      </div>
    </article>
  );
}
