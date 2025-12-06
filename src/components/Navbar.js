// src/components/Navbar.js
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

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
        zIndex: 20,
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

      {/* Right: only Logout */}
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
    </nav>
  );
}

export default Navbar;
