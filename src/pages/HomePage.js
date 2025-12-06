// src/pages/HomePage.js
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

function HomePage() {
  const navigate = useNavigate();

  const maxSlots = 2;
  const [tdmJoinedCount, setTdmJoinedCount] = useState(0); // total players
  const [alreadyJoined, setAlreadyJoined] = useState(false); // current user joined?
  const fillPercent = (tdmJoinedCount / maxSlots) * 100;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const colRef = collection(db, "tdm_registrations");
    const q = query(colRef, where("mode", "==", "TDM"));

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTdmJoinedCount(docs.length);
      const userHasJoined = docs.some((d) => d.user_uid === user.uid);
      setAlreadyJoined(userHasJoined);
    });

    return () => unsub();
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        backgroundImage: "url('/images/lobby-banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      {/* center container so large screens pe content beech me rahe */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            marginBottom: 16,
            textShadow: "0 2px 6px rgba(0,0,0,0.8)",
          }}
        >
          Today&apos;s Tournaments
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {/* 1v1 TDM CARD */}
          <div
            style={{
              padding: 16,
              borderRadius: 18,
              position: "relative",
              overflow: "hidden",
              backgroundImage: "url('/images/tdm-warehouse.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "inset 0 0 0 1000px rgba(0, 0, 0, 0.30)",
              border: "1px solid #1e293b",
              color: "#f9fafb",
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: 6,
                fontSize: 18,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              1v1 TDM – 9:00 PM
            </h3>

            <p
              style={{
                fontSize: 13,
                margin: 0,
                color: "#e5e7eb",
                fontWeight: 600,
              }}
            >
              Mode: <span style={{ color: "#facc15" }}>TDM</span>
            </p>
            <p
              style={{
                fontSize: 13,
                margin: 0,
                color: "#e5e7eb",
                fontWeight: 600,
              }}
            >
              Entry fee: <span style={{ color: "#f97316" }}>₹50</span>
            </p>
            <p
              style={{
                fontSize: 13,
                margin: 0,
                color: "#e5e7eb",
                fontWeight: 600,
              }}
            >
              Winner prize: <span style={{ color: "#4ade80" }}>₹80</span>
            </p>
            <p
              style={{
                fontSize: 13,
                margin: 0,
                color: "#e5e7eb",
              }}
            >
              Gun: <span style={{ color: "#38bdf8" }}>M416 only</span>
            </p>

            <p
              style={{
                fontSize: 12,
                color: "#f9fafb",
                marginTop: 8,
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              Slots:{" "}
              <span style={{ color: "#22c55e" }}>
                {tdmJoinedCount} / {maxSlots}
              </span>
            </p>

            <div
              style={{
                width: "100%",
                height: 10,
                borderRadius: 999,
                background: "rgba(15,23,42,0.8)",
                overflow: "hidden",
                border: "1px solid #1f2937",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: `${Math.min(fillPercent, 100)}%`,
                  height: "100%",
                  background:
                    fillPercent >= 100
                      ? "#22c55e"
                      : "linear-gradient(90deg,#22c55e,#4ade80)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {alreadyJoined ? (
              <div
                style={{
                  marginTop: 4,
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: "center",
                  textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                }}
              >
                Already joined
              </div>
            ) : tdmJoinedCount >= maxSlots ? (
              <div
                style={{
                  marginTop: 4,
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid #4b5563",
                  background: "rgba(15,23,42,0.9)",
                  color: "#d1d5db",
                  fontSize: 13,
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                Slots full
              </div>
            ) : (
              <button
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: "#22c55e",
                  color: "#020617",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/tournament/1v1-tdm")}
              >
                Quick join tournament
              </button>
            )}
          </div>

          {/* Classic Livik CARD */}
          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(2,6,23,0.9)",
              border: "1px solid #1e293b",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 4 }}>
              Classic Livik – 10:00 PM
            </h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
              Mode: Classic • Entry: ₹50 • Prize: ₹1,000 • Slots: 40/100
            </p>
          </div>

          {/* Winners CARD */}
          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(2,6,23,0.9)",
              border: "1px solid #1e293b",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 4 }}>Top Winners</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
              Coming soon: weekly leaderboard with highest earnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
