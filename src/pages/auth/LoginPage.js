// src/pages/auth/LoginPage.js
import "./LoginPage.css";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        setError("Please verify your email first. Check your inbox.");
      } else {
        setMsg("Login successful! Redirecting...");
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-login-screen">
      <div className="glass-bg-circle glass-bg-circle-1" />
      <div className="glass-bg-circle glass-bg-circle-2" />

      <div className="glass-card">
        <h2 className="glass-title">Welcome back</h2>
        <p className="glass-subtitle">Login to your BGMI Esports account</p>

        {msg && <p style={{ color: "#22c55e", fontSize: 12 }}>{msg}</p>}
        {error && <p style={{ color: "#f97373", fontSize: 12 }}>{error}</p>}

        <form className="glass-form" onSubmit={handleLogin}>
          <div className="glass-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="glass-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="glass-row">
            <label className="glass-remember">
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" className="glass-link">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="glass-primary-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="glass-secondary-btn"
            onClick={() => navigate("/signup")}
          >
            Create new account
          </button>
        </form>

        <p className="glass-bottom-text">
          New here?{" "}
          <Link to="/signup" className="glass-link-text">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
