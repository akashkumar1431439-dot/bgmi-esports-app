import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function App() {
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // Inside-app navigation: "list" | "tdm"
  const [screen, setScreen] = useState("list");

  // TDM form state
  const [bgmiUsername, setBgmiUsername] = useState("");
  const [bgmiId, setBgmiId] = useState("");
  const [bgmiLevel, setBgmiLevel] = useState("");
  const [joining, setJoining] = useState(false);

  // auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });
    return () => unsub();
  }, []);

  const isVerified = user && user.emailVerified;

  const handleSignup = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      setMessage("Signup successful. Check your email and verify account.");
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  const handleLoginOrRefresh = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (auth.currentUser) {
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser });
      }

      if (!auth.currentUser.emailVerified) {
        setMessage("Email not verified. Please check your inbox.");
      } else {
        setMessage("Login successful.");
        setScreen("list");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setScreen("list");
      setMessage("Logged out.");
    } catch (err) {
      console.error(err);
      setMessage("Logout error.");
    }
  };

  // TDM join (payment abhi test) – single active join per user
  const handleJoinTdm = async () => {
    if (!isVerified) {
      setMessage("TDM join ke liye verified login jaroori hai.");
      return;
    }
    if (!bgmiUsername.trim() || !bgmiId.trim() || !bgmiLevel.trim()) {
      setMessage("BGMI username, ID aur level tino bharna zaroori hai.");
      return;
    }

    try {
      setJoining(true);

      // 1) Check: kya is user ka already active TDM registration hai?
      const regsRef = collection(db, "tdm_registrations");
      const q = query(
        regsRef,
        where("user_uid", "==", user.uid),
        where("status", "in", ["requested", "playing"])
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        setMessage(
          "Tum already ek TDM match me joined ho. Pehle wo complete karo."
        );
        setJoining(false);
        return;
      }

      // 2) Nahi hai to naya registration create karo
      await addDoc(regsRef, {
        user_uid: user.uid,
        user_email: user.email,
        bgmi_username: bgmiUsername.trim(),
        bgmi_id: bgmiId.trim(),
        bgmi_level: bgmiLevel.trim(),
        mode: "TDM",
        entry_fee: 50,
        prize_for_winner: 80,
        platform_commission: 20,
        payment_status: "test_paid",
        status: "requested", // baad me admin isko "playing" / "completed" karega
        created_at: serverTimestamp(),
      });

      setMessage("TDM join request saved (test payment).");
      setBgmiUsername("");
      setBgmiId("");
      setBgmiLevel("");
    } catch (err) {
      console.error(err);
      setMessage("TDM join error, thodi der baad try karo.");
    } finally {
      setJoining(false);
    }
  };

  // ========= SCREEN 1: AUTH ONLY =========
  if (!user || !isVerified) {
    return (
      <div
        style={{
          padding: 20,
          fontFamily: "sans-serif",
          color: "#fff",
          background: "#111",
          minHeight: "100vh",
        }}
      >
        <h1>BGMI Esports</h1>

        <div
          style={{
            marginTop: 20,
            padding: 16,
            border: "1px solid #444",
            maxWidth: 400,
          }}
        >
          <h2>Signup / Login</h2>

          <input
            style={{ width: "100%", marginBottom: 8, padding: 6 }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={{ width: "100%", marginBottom: 8, padding: 6 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleSignup} style={{ marginRight: 8 }}>
            Signup
          </button>
          <button onClick={handleLoginOrRefresh}>
            Login / Refresh status
          </button>

          {user && !isVerified && (
            <p style={{ marginTop: 10, color: "orange" }}>
              Email verify karo: inbox / spam me Firebase ki mail check karo,
              fir yahi button dabao. Verified hone ke baad app khul jayega.
            </p>
          )}
        </div>

        {message && (
          <p style={{ marginTop: 20, color: "yellow" }}>{message}</p>
        )}
      </div>
    );
  }

  // ========= SCREEN 2A: TOURNAMENT LIST =========
  if (screen === "list") {
    return (
      <div
        style={{
          padding: 20,
          fontFamily: "sans-serif",
          color: "#fff",
          background: "#111",
          minHeight: "100vh",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>BGMI Esports - Tournaments</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <p style={{ marginBottom: 10 }}>
          Logged in as <b>{user.email}</b> (Verified)
        </p>

        <div
          style={{
            marginTop: 10,
            padding: 16,
            border: "1px solid #444",
            maxWidth: 600,
          }}
        >
          <h2>Available Tournaments</h2>

          <div
            style={{
              marginTop: 10,
              padding: 12,
              border: "1px solid #333",
            }}
          >
            <h3>BGMI 1v1 TDM</h3>
            <p style={{ margin: 0 }}>Mode: 1v1 TDM</p>
            <p style={{ margin: 0 }}>Entry fee: ₹50</p>
            <p style={{ margin: 0 }}>Winner prize: ₹80</p>
            <button
              style={{ marginTop: 8 }}
              onClick={() => setScreen("tdm")}
            >
              Open details / Join
            </button>
          </div>
        </div>

        {message && (
          <p style={{ marginTop: 20, color: "yellow" }}>{message}</p>
        )}
      </div>
    );
  }

  // ========= SCREEN 2B: TDM DETAIL + JOIN =========
  return (
    <div
      style={{
        padding: 20,
        fontFamily: "sans-serif",
        color: "#fff",
        background: "#111",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>BGMI 1v1 TDM Tournament</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p>
        Logged in as <b>{user.email}</b> (Verified)
      </p>

      <button
        style={{ marginBottom: 16 }}
        onClick={() => setScreen("list")}
      >
        ← Back to Tournaments
      </button>

      <div
        style={{
          padding: 16,
          border: "1px solid #444",
          maxWidth: 500,
        }}
      >
        <h2>Details</h2>
        <p style={{ margin: 0 }}>Mode: 1v1 Team Deathmatch (TDM)</p>
        <p style={{ margin: 0 }}>Entry fee: ₹50 per player</p>
        <p style={{ margin: 0 }}>Winner prize: ₹80</p>
        <p style={{ margin: 0 }}>Map: TDM Warehouse / custom room</p>
        <p style={{ margin: 0 }}>Time: Daily 8:00 PM – 8:30 PM (example)</p>

        <div style={{ marginTop: 15 }}>
          <h3>Join TDM</h3>
          <input
            style={{ width: "100%", marginBottom: 8, padding: 6 }}
            type="text"
            placeholder="BGMI Username"
            value={bgmiUsername}
            onChange={(e) => setBgmiUsername(e.target.value)}
          />
          <input
            style={{ width: "100%", marginBottom: 8, padding: 6 }}
            type="text"
            placeholder="BGMI ID Number"
            value={bgmiId}
            onChange={(e) => setBgmiId(e.target.value)}
          />
          <input
            style={{ width: "100%", marginBottom: 8, padding: 6 }}
            type="number"
            placeholder="BGMI Level"
            value={bgmiLevel}
            onChange={(e) => setBgmiLevel(e.target.value)}
          />
          <button onClick={handleJoinTdm} disabled={joining}>
            {joining ? "Joining..." : "Join (₹50 test – no real payment)"}
          </button>
          <p style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
            Abhi payment test mode me hai; baad me Razorpay/UPI se real ₹50
            payment add karenge.
          </p>
        </div>
      </div>

      {message && (
        <p style={{ marginTop: 20, color: "yellow" }}>{message}</p>
      )}
    </div>
  );
}

export default App;
