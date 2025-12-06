// src/components/Navbar.js
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav
      style={{
        height: 56,
        padding: "0 32px",
        background: "#020617cc",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, color: "#22c55e" }}>
        BGMI ESPORTS
      </div>

      <div style={{ display: "flex", gap: 20, fontSize: 14, alignItems: "center" }}>
        <Link
          to="/home"
          style={{
            color: isActive("/home") ? "#ffffff" : "#e5e7eb",
            textDecoration: "none",
          }}
        >
          Home
        </Link>

        <span style={{ color: "#6b7280" }}>Tournaments (soon)</span>

        <Link
          to="/joined"
          style={{
            color: isActive("/joined") ? "#ffffff" : "#e5e7eb",
            textDecoration: "none",
          }}
        >
          Joined
        </Link>

        <Link
          to="/deposit"
          style={{
            color: isActive("/deposit") ? "#ffffff" : "#e5e7eb",
            textDecoration: "none",
          }}
        >
          Deposit
        </Link>

        <Link
          to="/profile"
          style={{
            color: isActive("/profile") ? "#ffffff" : "#e5e7eb",
            textDecoration: "none",
          }}
        >
          Profile
        </Link>

        <button
          onClick={handleLogout}
          style={{
            marginLeft: 8,
            padding: "6px 14px",
            borderRadius: 999,
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
