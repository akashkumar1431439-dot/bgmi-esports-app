// src/pages/DepositUploadPage.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function DepositUploadPage() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const query = useQuery();
  const amount = Number(query.get("amount") || 0);

  const [file, setFile] = useState(null);
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

    if (!file) {
      setError("Payment ka screenshot select karo.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Sirf image file (JPG/PNG) upload kar sakte ho.");
      return;
    }

    setLoading(true);
    try {
      // 1) Screenshot upload
      const path = `screenshots/${user.uid}/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      // 2) Firestore me request doc
      await addDoc(collection(db, "topup_requests"), {
        user_uid: user.uid,
        user_email: user.email,
        amount,
        status: "pending",
        screenshot_url: url,
        screenshot_filename: file.name,
        created_at: serverTimestamp(),
      });

      navigate("/deposit/history");
    } catch (err) {
      console.error("Upload or save failed:", err);
      setError("Kuch galat ho gaya, thodi der baad dobara try karo.");
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
          UPI payment karne ke baad yahan amount confirm karo aur apna payment
          screenshot upload karke request bhejo. Admin screenshot dekh kar same
          amount tumhare wallet me add karega.
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
              Payment screenshot * (Jaruri hai)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0] || null)}
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
              marginTop: 10,
              height: 44,
              borderRadius: 999,
              border: "none",
              background: loading ? "#6b7280" : "#22c55e",
              color: "#020617",
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending request..." : "Send top‑up request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DepositUploadPage;
