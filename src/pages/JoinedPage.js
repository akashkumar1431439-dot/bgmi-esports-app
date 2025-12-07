// src/pages/JoinedPage.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

function JoinedPage() {
  const [joinedTournaments, setJoinedTournaments] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const regCol = collection(db, "tdm_registrations");
    const qReg = query(regCol, where("user_uid", "==", user.uid));

    const unsubRegs = onSnapshot(qReg, (regSnap) => {
      const regs = regSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (regs.length === 0) {
        setJoinedTournaments([]);
        return;
      }

      const tournamentIds = Array.from(
        new Set(regs.map((r) => r.tournament_id).filter(Boolean))
      );

      if (tournamentIds.length === 0) {
        setJoinedTournaments(regs);
        return;
      }

      const roomsCol = collection(db, "tdm_rooms");
      const qRooms = query(roomsCol, where("tournament_id", "in", tournamentIds));

      const unsubRooms = onSnapshot(qRooms, (roomSnap) => {
        const rooms = roomSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const merged = regs.map((reg) => {
          const room = rooms.find(
            (r) => r.tournament_id === reg.tournament_id
          );
          return {
            ...reg,
            room_id: room?.room_id || reg.room_id,
            room_password: room?.room_pass || reg.room_password,
          };
        });

        setJoinedTournaments(merged);
      });

      return () => unsubRooms();
    });

    return () => unsubRegs();
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        backgroundImage:
          "url('/images/neon_bgmi_logo.png'), radial-gradient(circle at top, rgba(15,23,42,0.65), rgba(15,23,42,0.9))",
        backgroundBlendMode: "screen",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#e5e7eb",
        padding: "32px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* page heading */}
      <div>
        <p
          style={{
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#22d3ee",
            marginBottom: 4,
            fontWeight: 600,
            textShadow: "0 0 8px rgba(56,189,248,0.9)",
          }}
        >
          Player lobby
        </p>
        <h1
          style={{
            fontSize: 26,
            margin: 0,
            fontWeight: 700,
            color: "#f9fafb",
            textShadow:
              "0 0 16px rgba(56,189,248,0.8), 0 0 26px rgba(59,130,246,0.8)",
          }}
        >
          Joined tournaments
        </h1>
      </div>

      {/* empty state */}
      {joinedTournaments.length === 0 && (
        <div
          style={{
            maxWidth: 520,
            padding: "18px 20px",
            borderRadius: 18,
            border: "1px dashed rgba(148,163,184,0.7)",
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), rgba(15,23,42,0.78)",
            backdropFilter: "blur(12px)",
            fontSize: 13,
            color: "#9ca3af",
          }}
        >
          You have not joined any tournaments yet. When you join a 1v1 TDM, it
          will appear here with room details.
        </div>
      )}

      {/* joined cards */}
      {joinedTournaments.map((t) => (
        <div
          key={t.id}
          style={{
            maxWidth: 720,
            borderRadius: 24,
            padding: 22,
            marginBottom: 16,
            position: "relative",
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.32), transparent 55%), radial-gradient(circle at bottom right, rgba(244,114,182,0.22), transparent 55%), rgba(15,23,42,0.92)",
            border: "1px solid rgba(59,130,246,0.9)",
            boxShadow:
              "0 0 30px rgba(56,189,248,0.45), 0 22px 45px rgba(15,23,42,0.95)",
            overflow: "hidden",
          }}
        >
          {/* glowing border accent */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              border: "1px solid transparent",
              background:
                "linear-gradient(120deg, rgba(45,212,191,0.6), rgba(56,189,248,0.8), rgba(244,114,182,0.7)) border-box",
              mask:
                "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
              WebkitMask:
                "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              pointerEvents: "none",
              opacity: 0.7,
            }}
          />

          {/* top row: title + tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 10,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#f9fafb",
                  fontWeight: 800,
                  textShadow:
                    "0 0 10px rgba(56,189,248,0.9), 0 0 18px rgba(59,130,246,0.8)",
                }}
              >
                1v1 TDM
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#cbd5f5",
                }}
              >
                You successfully joined this tournament.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  padding: "4px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(52,211,153,0.9)",
                  color: "#bbf7d0",
                  background:
                    "radial-gradient(circle at top, rgba(34,197,94,0.4), transparent 70%)",
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                  fontWeight: 600,
                  boxShadow:
                    "0 0 14px rgba(34,197,94,0.7), 0 0 26px rgba(52,211,153,0.6)",
                }}
              >
                Registered
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                }}
              >
                Match type: Solo 1v1
              </span>
            </div>
          </div>

          {/* bottom content: room info */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: 6,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Entry / Prize / Mode line removed */}

            <div
              style={{
                padding: 12,
                borderRadius: 18,
                border: "1px dashed rgba(148,163,184,0.9)",
                fontSize: 13,
                background:
                  "linear-gradient(120deg, rgba(15,23,42,0.96), rgba(15,23,42,0.82))",
                boxShadow: "0 0 18px rgba(15,23,42,0.9)",
              }}
            >
              <p style={{ margin: 0, marginBottom: 4 }}>
                Room ID:{" "}
                <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                  {t.room_id || "Coming soon"}
                </span>
              </p>
              <p style={{ margin: 0 }}>
                Room password:{" "}
                <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                  {t.room_password || "Coming soon"}
                </span>
              </p>
            </div>

            <p
              style={{
                margin: 0,
                marginTop: 6,
                fontSize: 11,
                color: "#9ca3af",
              }}
            >
              Room details will be updated here 10–15 minutes before match
              start. Please keep this tab open at that time.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JoinedPage;
