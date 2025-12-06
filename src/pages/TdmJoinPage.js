// src/pages/TdmJoinPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  serverTimestamp,
  runTransaction,
  query,
  where,
  getDocs,
} from "firebase/firestore";


function TdmJoinPage() {
  const [ign, setIgn] = useState("");
  const [bgmiId, setBgmiId] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const ENTRY_FEE = 50;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");


    const user = auth.currentUser;
    if (!user) {
      setError("Please login again.");
      return;
    }


    setLoading(true);
    try {
      const regRef = collection(db, "tdm_registrations");


      // 1) Check: already joined same tournament?
      const qJoined = query(
        regRef,
        where("user_uid", "==", user.uid),
        where("tournament_id", "==", "tdm_1v1")
      );
      const joinedSnap = await getDocs(qJoined);
      if (!joinedSnap.empty) {
        setError("You have already joined this tournament.");
        setLoading(false);
        return;
      }


      // 2) Transaction: wallet se 50 rs minus + registration create
      const userRef = doc(db, "users", user.uid);


      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) {
          throw new Error("USER_NOT_FOUND");
        }


        const udata = userSnap.data();
        const currentBalance = udata.wallet_balance || 0;


        if (currentBalance < ENTRY_FEE) {
          throw new Error("INSUFFICIENT_FUNDS");
        }


        // wallet update
        transaction.update(userRef, {
          wallet_balance: currentBalance - ENTRY_FEE,
        });


        // tdm_registrations me naya doc
        const newRegRef = doc(regRef); // auto id
        transaction.set(newRegRef, {
          bgmi_id: bgmiId,
          bgmi_level: Number(level),
          bgmi_username: ign,
          created_at: serverTimestamp(),
          entry_fee: ENTRY_FEE,
          mode: "TDM",
          payment_status: "wallet_paid",
          platform_commission: 20,
          prize_for_winner: 80,
          status: "joined",
          user_email: user.email,
          user_uid: user.uid,
          tournament_id: "tdm_1v1",
        });
      });


      setMsg("You successfully joined 1v1 TDM! ₹50 deducted from your wallet.");
      navigate("/joined");
    } catch (err) {
      console.error(err);
      if (err.message === "INSUFFICIENT_FUNDS") {
        setError("Not enough balance. You need ₹50 in your wallet.");
      } else if (err.message === "USER_NOT_FOUND") {
        setError("User profile not found. Please relogin.");
      } else {
        setError("Failed to join. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        background:
          "radial-gradient(circle at top, #020617 0, #020617 55%, #000 100%)",
        color: "#e5e7eb",
        padding: "24px 40px",
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>1v1 TDM</h1>


      <div
        style={{
          maxWidth: 420,
          padding: 20,
          borderRadius: 18,
          background: "#020617",
          border: "1px solid #1f2937",
        }}
      >
        {msg && (
          <p style={{ fontSize: 13, marginBottom: 8, color: "#22c55e" }}>
            {msg}
          </p>
        )}
        {error && (
          <p style={{ fontSize: 13, marginBottom: 8, color: "#f97373" }}>
            {error}
          </p>
        )}


        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div>
            <label style={{ fontSize: 13 }}>BGMI In‑Game Name</label>
            <input
              type="text"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              required
              placeholder="Your BGMI name"
              style={{
                width: "100%",
                marginTop: 4,
                height: 36,
                borderRadius: 10,
                border: "1px solid #374151",
                background: "#020617",
                color: "#e5e7eb",
                padding: "0 10px",
                fontSize: 13,
              }}
            />
          </div>


          <div>
            <label style={{ fontSize: 13 }}>BGMI ID</label>
            <input
              type="text"
              value={bgmiId}
              onChange={(e) => setBgmiId(e.target.value)}
              required
              placeholder="1234567890"
              style={{
                width: "100%",
                marginTop: 4,
                height: 36,
                borderRadius: 10,
                border: "1px solid #374151",
                background: "#020617",
                color: "#e5e7eb",
                padding: "0 10px",
                fontSize: 13,
              }}
            />
          </div>


          <div>
            <label style={{ fontSize: 13 }}>BGMI Level</label>
            <input
              type="number"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              min={1}
              placeholder="e.g. 55"
              style={{
                width: "100%",
                marginTop: 4,
                height: 36,
                borderRadius: 10,
                border: "1px solid #374151",
                background: "#020617",
                color: "#e5e7eb",
                padding: "0 10px",
                fontSize: 13,
              }}
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              height: 40,
              borderRadius: 999,
              border: "none",
              background: "#22c55e",
              color: "#020617",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {loading ? "Submitting..." : "Submit & Join (₹50 from wallet)"}
          </button>
        </form>
      </div>
    </div>
  );
}


export default TdmJoinPage;