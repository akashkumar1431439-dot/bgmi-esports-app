// src/pages/DepositUploadPage.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function DepositUploadPage() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const query = useQuery();
  const amount = Number(query.get("amount") || 0);

  const [senderName, setSenderName] = useState("");
  const [upiRef, setUpiRef] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
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
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>Deposit</h1>
        <p style={{ fontSize: 13, color: "#9ca3af" }}>
          Please login again to use deposit feature.
        </p>
      </div>
    );
  }

  if (!amount || amount <= 0) {
    navigate("/deposit");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!senderName.trim()) {
      setError("UPI app me jo naam dikh raha hai, woh yahan likho.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "topup_requests"), {
        user_uid: user.uid,
        user_email: user.email,
        amount,
        sender_name: senderName.trim(),
        upi_ref: upiRef.trim(),
        note: note.trim(),
        status: "pending",
        created_at: serverTimestamp(),
      });

      // Pending request ban gayi; ab history page pe bhej do
      navigate("/deposit/history");
    } catch (err) {
      console.error(err);
      setError("Request save nahi ho payi, dobara try karo.");
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
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Payment details</h1>

      <div
        style={{
          maxWidth: 520,
          padding: 20,
          borderRadius: 18,
          background: "#020617",
          border: "1px solid #1f2937",
        }}
      >
        <p style={{ fontSize: 13, marginBottom: 8, color: "#9ca3af" }}>
          Yahan par apne UPI payment ki details do. Hum tumhara payment manual
          verify karke utne hi coins tumhare wallet me add karenge. Agar
          details galat hongi to request reject ho sakti hai.
        </p>

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
            <label style={{ fontSize: 13 }}>Amount paid (₹)</label>
            <input
              type="number"
              value={amount}
              readOnly
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
                opacity: 0.7,
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13 }}>
              Name shown in your UPI app
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              required
              placeholder="UPI sender name"
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
            <label style={{ fontSize: 13 }}>
              UPI transaction ID (optional)
            </label>
            <input
              type="text"
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
              placeholder="UPI ref no."
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
            <label style={{ fontSize: 13 }}>
              Extra note (optional, e.g. time of payment)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                marginTop: 4,
                borderRadius: 10,
                border: "1px solid #374151",
                background: "#020617",
                color: "#e5e7eb",
                padding: "6px 10px",
                fontSize: 13,
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 10,
              height: 44,
              borderRadius: 999,
              border: "none",
              background: "#22c55e",
              color: "#020617",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {loading ? "Saving..." : "Submit details"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DepositUploadPage;
