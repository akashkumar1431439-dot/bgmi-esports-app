// src/components/BottomNav.js
import { useLocation, useNavigate } from "react-router-dom";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.startsWith(path);

  const itemStyle = (active) => ({
    flex: 1,
    textAlign: "center",
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: 11,
    fontWeight: active ? 700 : 500,
    color: active ? "#ffffff" : "#e5e7eb",
    opacity: active ? 1 : 0.75,
    background: "transparent",
    border: "none",
  });

  const iconDotStyle = (active) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    margin: "0 auto 2px",
    background: active ? "#22c55e" : "#6b7280",
  });

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: 56,
        background: "rgba(15,23,42,0.98)",
        borderTop: "1px solid #1f2937",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        zIndex: 30,
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => navigate("/home")}
        style={itemStyle(isActive("/home"))}
      >
        <div style={iconDotStyle(isActive("/home"))} />
        Home
      </button>

      <button
        onClick={() => navigate("/joined")}
        style={itemStyle(isActive("/joined"))}
      >
        <div style={iconDotStyle(isActive("/joined"))} />
        Joined
      </button>

      <button
        onClick={() => navigate("/deposit")}
        style={itemStyle(isActive("/deposit"))}
      >
        <div style={iconDotStyle(isActive("/deposit"))} />
        Deposit
      </button>

      <button
        onClick={() => navigate("/profile")}
        style={itemStyle(isActive("/profile"))}
      >
        <div style={iconDotStyle(isActive("/profile"))} />
        Profile
      </button>
    </div>
  );
}

export default BottomNav;
