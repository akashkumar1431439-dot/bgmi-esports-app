// src/pages/auth/SignupPage.js
import "./LoginPage.css";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  runTransaction,
} from "firebase/firestore";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // number -> AS-0001 format
  const formatCustomId = (num) => {
    const padded = String(num).padStart(4, "0"); // 1 -> "0001"
    return `AS-${padded}`;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1) Firebase Auth user create
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 2) Email verification bhejna
      await sendEmailVerification(cred.user);

      // 3) Firestore transaction: lastCustomId++ and create user doc
      const countersRef = doc(db, "meta", "counters");
      const usersCol = collection(db, "users");

      await runTransaction(db, async (transaction) => {
        const counterSnap = await transaction.get(countersRef);

        let last = 0;
        if (counterSnap.exists()) {
          last = counterSnap.data().lastCustomId || 0;
        }

        const nextNumber = last + 1;
        const newCustomId = formatCustomId(nextNumber); // e.g. AS-0001

        // update counter
        transaction.set(
          countersRef,
          { lastCustomId: nextNumber },
          { merge: true }
        );

        // create user doc with custom_id & wallet
        const userDocRef = doc(usersCol, cred.user.uid);
        transaction.set(userDocRef, {
          uid: cred.user.uid,
          email: cred.user.email,
          emailVerified: cred.user.emailVerified,
          custom_id: newCustomId,
          wallet_balance: 0,
          createdAt: new Date(),
        });
      });

      setMsg(
        "Account created. Verification email sent — please check your inbox."
      );
      // user yahi rahega; verify karke khud /login par aayega
    } catch (err) {
      console.error(err);
      setError("Could not create account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-login-screen">
      <div className="glass-bg-circle glass-bg-circle-1" />
      <div className="glass-bg-circle glass-bg-circle-2" />

      <div className="glass-card">
        <h2 className="glass-title">Create account</h2>
        <p className="glass-subtitle">Signup with your email</p>

        {msg && <p style={{ color: "#22c55e", fontSize: 12 }}>{msg}</p>}
        {error && <p style={{ color: "#f97373", fontSize: 12 }}>{error}</p>}

        <form className="glass-form" onSubmit={handleSignup}>
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

          <div className="glass-field">
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="glass-primary-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Signup"}
          </button>

          <button
            type="button"
            className="glass-secondary-btn"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>

        <p className="glass-bottom-text">
          Already have an account?{" "}
          <Link to="/login" className="glass-link-text">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
