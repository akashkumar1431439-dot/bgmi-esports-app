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

  const linkBaseStyle = (active) => ({
    color: active ? "#ffffff" : "#e5e7eb",
    textDecoration: "none",
    whiteSpace: "nowrap",
  });

  return (
    <nav
      style={{
        height: 56,
        padding: "0 12px",
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
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Left logo */}
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          color: "#22c55e",
          whiteSpace: "nowrap",
        }}
      >
        BGMI ESPORTS
      </div>

      {/* Right links: Home + Joined + Deposit + Profile + Logout */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          rowGap: 4,
          columnGap: 12,
          fontSize: 13,
          alignItems: "center",
          justifyContent: "flex-end",
          maxWidth: "100%",
        }}
      >
        <Link to="/home" style={linkBaseStyle(isActive("/home"))}>
          Home
        </Link>

        <Link to="/joined" style={linkBaseStyle(isActive("/joined"))}>
          Joined
        </Link>

        <Link to="/deposit" style={linkBaseStyle(isActive("/deposit"))}>
          Deposit
        </Link>

        <Link to="/profile" style={linkBaseStyle(isActive("/profile"))}>
          Profile
        </Link>

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
