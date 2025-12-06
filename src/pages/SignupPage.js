import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function SignupPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
try {
await createUserWithEmailAndPassword(auth, email, password);
navigate("/");
} catch (err) {
setError("Signup failed: " + err.message);
}
};

return (
<div style={{ padding: 20 }}>
<h2>Signup</h2>
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

    <button type="submit">Create Account</button>
  </form>

  <p style={{ marginTop: 10 }}>
    Already have an account? <Link to="/login">Login</Link>
  </p>
</div>
);
}

export default SignupPage;