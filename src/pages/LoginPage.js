import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
try {
await signInWithEmailAndPassword(auth, email, password);
navigate("/");
} catch (err) {
setError("Login failed: " + err.message);
}
};

return (
<div style={{ padding: 20 }}>
<h2>Login</h2>
{error && <p style={{ color: "red" }}>{error}</p>}
  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300 }}>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button type="submit">Login</button>
  </form>

  <p style={{ marginTop: 10 }}>
    No account? <Link to="/signup">Signup</Link>
  </p>
</div>
);
}

export default LoginPage;