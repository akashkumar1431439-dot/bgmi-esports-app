// src/pages/ProfilePage.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

function ProfilePage() {
  const user = auth.currentUser;
  const [joinStats, setJoinStats] = useState({
    totalJoined: 0,
    totalWins: 0,
  });
  const [wallet, setWallet] = useState(0);
  const [customId, setCustomId] = useState("");
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [userDocId, setUserDocId] = useState(null);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoadingStats(false);
      setLoadingProfile(false);
      return;
    }

    const regRef = collection(db, "tdm_registrations");
    const qRegs = query(regRef, where("user_uid", "==", user.uid));

    const unsubRegs = onSnapshot(
      qRegs,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const totalJoined = docs.length;
        const totalWins = docs.filter((d) => d.status === "won").length;

        setJoinStats({ totalJoined, totalWins });
        setLoadingStats(false);
      },
      (err) => {
        console.error("Profile stats error:", err);
        setLoadingStats(false);
      }
    );

    const usersRef = collection(db, "users");
    const qUser = query(usersRef, where("uid", "==", user.uid));

    const unsubUser = onSnapshot(
      qUser,
      (snap) => {
        if (snap.empty) {
          setLoadingProfile(true);
          return;
        }
        const docSnap = snap.docs[0];
        const data = docSnap.data();
        setUserDocId(docSnap.id);
        setWallet(data.wallet_balance || 0);
        setCustomId(data.custom_id || "");
        setDisplayName(data.display_name || "BGMI Player");
        setLoadingProfile(false);
      },
      (err) => {
        console.error("User profile error:", err);
        setLoadingProfile(false);
      }
    );

    return () => {
      unsubRegs();
      unsubUser();
    };
  }, [user]);

  const handleSaveName = async () => {
    if (!userDocId) return;
    const trimmed = displayName.trim();
    if (!trimmed) {
      setNameError("Name empty nahi ho sakta.");
      return;
    }
    if (trimmed.length < 3) {
      setNameError("Name kam se kam 3 characters ka hona chahiye.");
      return;
    }

    setNameError("");
    setSavingName(true);
    try {
      await updateDoc(doc(db, "users", userDocId), {
        display_name: trimmed,
      });
      setEditingName(false);
    } catch (err) {
      console.error("Save name error:", err);
      setNameError("Name save nahi hua, baad me try karo.");
    } finally {
      setSavingName(false);
    }
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 56px)",
          backgroundImage: "url('/images/Profile.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#f9fafb",
          padding: "24px 40px",
          textShadow: "0 0 6px rgba(0,0,0,0.9)",
        }}
      >
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>Profile</h1>
        <p style={{ fontSize: 13, color: "#e5e7eb" }}>
          Please login again to see your profile.
        </p>
      </div>
    );
  }

  const initialLetter =
    (displayName && displayName[0]?.toUpperCase()) ||
    user.email?.[0]?.toUpperCase() ||
    "P";

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        backgroundImage: "url('/images/Profile.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#f9fafb",
        padding: "24px 40px",
        textShadow: "0 0 6px rgba(0,0,0,0.9)", // sab text ko glow + readability
      }}
    >
      <h1
        style={{
          fontSize: 26,
          marginBottom: 20,
          fontWeight: 700,
          color: "#fefce8", // thoda warm white
        }}
      >
        Player profile
      </h1>

      {/* Top hero card */}
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: "50%",
            background:
              "conic-gradient(from 180deg, #facc15, #22c55e, #0ea5e9, #a855f7, #f97316)",
            padding: 3,
            boxShadow: "0 0 20px rgba(0,0,0,0.9)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "rgba(15,23,42,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              color: "#f9fafb",
            }}
          >
            {initialLetter}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {editingName ? (
              <>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={20}
                  style={{
                    height: 32,
                    borderRadius: 10,
                    border: "1px solid rgba(148,163,184,0.7)",
                    background: "rgba(15,23,42,0.9)",
                    color: "#f9fafb",
                    padding: "0 10px",
                    fontSize: 14,
                  }}
                />
                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  style={{
                    height: 32,
                    padding: "0 12px",
                    borderRadius: 999,
                    border: "none",
                    background:
                      "linear-gradient(90deg,#22c55e,#a3e635,#facc15)",
                    color: "#022c22",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 0 12px rgba(34,197,94,0.8)",
                  }}
                >
                  {savingName ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setNameError("");
                  }}
                  style={{
                    height: 32,
                    padding: "0 10px",
                    borderRadius: 999,
                    border: "none",
                    background: "rgba(15,23,42,0.9)",
                    color: "#e5e7eb",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#e0f2fe",
                  }}
                >
                  {displayName || "BGMI Player"}
                </h2>
                <button
                  onClick={() => setEditingName(true)}
                  style={{
                    height: 26,
                    padding: "0 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.8)",
                    background: "rgba(15,23,42,0.7)",
                    color: "#bfdbfe",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  Edit name
                </button>
              </>
            )}
          </div>

          {nameError && (
            <p
              style={{
                margin: 0,
                marginTop: 4,
                fontSize: 11,
                color: "#fecaca",
              }}
            >
              {nameError}
            </p>
          )}

          <p
            style={{
              margin: 0,
              marginTop: 4,
              fontSize: 12,
              color: "#a5f3fc", // cyan label
            }}
          >
            Player ID:{" "}
            <span style={{ color: "#fef9c3", fontWeight: 600 }}>
              {loadingProfile ? "Loading..." : customId || "Not assigned"}
            </span>
          </p>
        </div>
      </div>

      {/* Stats + Wallet row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            flex: "0 0 180px",
            padding: 16,
            borderRadius: 18,
            background: "rgba(15,23,42,0.92)",
            border: "1px solid rgba(148,163,184,0.7)",
            boxShadow: "0 0 18px rgba(15,23,42,0.9)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#7dd3fc",
              marginBottom: 4,
            }}
          >
            Tournaments joined
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "#fefce8",
            }}
          >
            {loadingStats ? "…" : joinStats.totalJoined}
          </p>
        </div>

        <div
          style={{
            flex: "0 0 180px",
            padding: 16,
            borderRadius: 18,
            background: "rgba(15,23,42,0.92)",
            border: "1px solid rgba(148,163,184,0.7)",
            boxShadow: "0 0 18px rgba(15,23,42,0.9)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#7dd3fc",
              marginBottom: 4,
            }}
          >
            Wins
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "#bbf7d0",
            }}
          >
            {loadingStats ? "…" : joinStats.totalWins}
          </p>
        </div>

        <div
          style={{
            flex: "0 0 200px",
            padding: 16,
            borderRadius: 18,
            background: "rgba(15,23,42,0.96)",
            border: "1px solid rgba(190,242,100,0.9)",
            boxShadow: "0 0 22px rgba(190,242,100,0.6)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#bef264",
              marginBottom: 4,
            }}
          >
            Wallet balance
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: "#fef9c3",
            }}
          >
            ₹{wallet}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
