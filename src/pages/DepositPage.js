// src/pages/DepositPage.js
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

const AMOUNTS = [50, 100, 200, 300, 400, 500, 600, 700];

function DepositPage() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAmount, setSelectedAmount] = useState(null);

  const isScanPage = location.pathname.includes("/deposit/qr");

  if (!user) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 56px)",
          backgroundImage:
            "linear-gradient(135deg,#020617 0%,#020617 45%,#000 100%), url('/images/deoosit.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "multiply",
          color: "#e5e7eb",
          padding: "24px 40px",
        }}
      >
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>Deposit / Add coins</h1>
        <p style={{ fontSize: 13, color: "#9ca3af" }}>
          Please login again to use deposit feature.
        </p>
      </div>
    );
  }

  // ========== SCAN & PAY PAGE ==========
  if (isScanPage) {
    const searchParams = new URLSearchParams(location.search);
    const amount = Number(searchParams.get("amount") || 0);

    const handleScanContinue = () => {
      navigate(`/deposit/upload?amount=${amount}`);
    };

    return (
      <div
        style={{
          minHeight: "calc(100vh - 56px)",
          backgroundImage:
            "linear-gradient(135deg,rgba(3,7,18,0.96),rgba(3,7,18,0.9)), url('/images/scanpay_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "screen",
          color: "#e5e7eb",
          padding: "32px 40px",
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 20 }}>Scan &amp; pay</h1>

        <div
          style={{
            maxWidth: 460,
            borderRadius: 22,
            padding: 20,
            background: "rgba(15,23,42,0.96)",
            border: "1px solid #1f2937",
          }}
        >
          <p
            style={{
              fontSize: 13,
              marginBottom: 12,
              color: "#d1d5db",
            }}
          >
            Please pay{" "}
            <strong style={{ color: "#facc15" }}>₹{amount}</strong> to the below
            UPI‑QR. Payment sirf is QR / UPI ID par hi kare.
          </p>

          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: 18,
              overflow: "hidden",
              marginBottom: 12,
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/images/my-upi-qr.png"
              alt="UPI QR"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              lineHeight: 1.5,
              marginBottom: 18,
            }}
          >
            Payment complete hone ke baad UPI screen ka clear screenshot le lo.
            Next step me app tumse ye screenshot / details mangega.
          </p>

          <button
            type="button"
            onClick={handleScanContinue}
            style={{
              width: "100%",
              height: 44,
              borderRadius: 999,
              border: "none",
              background: "#22c55e",
              color: "#022c22",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            I have paid, continue
          </button>
        </div>
      </div>
    );
  }

  // ========== NORMAL DEPOSIT PAGE ==========
  const handleContinue = () => {
    if (!selectedAmount) return;
    navigate(`/deposit/qr?amount=${selectedAmount}`);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        backgroundImage:
          "linear-gradient(135deg,rgba(2,6,23,0.95) 0%,rgba(2,6,23,0.9) 40%,rgba(0,0,0,0.92) 100%), url('/images/deoosit.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        color: "#e5e7eb",
        padding: "32px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <h1
        style={{
          fontSize: 24,
          margin: 0,
          fontWeight: 700,
          color: "#f9fafb",
          textShadow: "0 0 14px rgba(250,204,21,0.9)",
        }}
      >
        Deposit / Add coins
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        {/* Left info box */}
        <div
          style={{
            flex: "1 1 320px",
            maxWidth: 420,
            padding: 20,
            borderRadius: 18,
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), rgba(15,23,42,0.92)",
            border: "1px solid rgba(30,64,175,0.9)",
            boxShadow:
              "0 0 20px rgba(15,23,42,0.95), 0 0 26px rgba(56,189,248,0.25)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            How deposit works
          </p>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.5 }}>
            1. Pehle upar se koi amount select karo (₹100, ₹200, etc.). <br />
            2. <strong>Deposit</strong> button dabane ke baad tumhe hamara
            UPI‑QR dikhega, jisme tum payment karoge. <br />
            3. Payment complete hone ke baad tumse ek alag page par{" "}
            <strong>payment ka screenshot / details</strong> maange jayenge.
            Admin verify karke utne hi paise tumhare wallet me add kar diye
            jayenge. <br />
            4. Tension lene ki jarurat nahi hai, aapke paise safely wallet me
            add kar diye jayenge. App real hai.
          </p>
        </div>

        {/* Right: amount boxes + button */}
        <div
          style={{
            flex: "1 1 320px",
            maxWidth: 480,
            padding: 20,
            borderRadius: 18,
            background:
              "radial-gradient(circle at top right, rgba(250,204,21,0.16), transparent 55%), rgba(15,23,42,0.94)",
            border: "1px solid rgba(31,41,55,0.9)",
            boxShadow:
              "0 0 20px rgba(15,23,42,0.95), 0 0 26px rgba(250,204,21,0.25)",
          }}
        >
          <p style={{ fontSize: 13, marginBottom: 12, color: "#9ca3af" }}>
            Deposit amount select karo:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {AMOUNTS.map((amt) => {
              const active = selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  style={{
                    height: 48,
                    borderRadius: 12,
                    border: active
                      ? "1px solid #fbbf24"
                      : "1px solid #374151",
                    background: active
                      ? "linear-gradient(135deg,#fde68a,#facc15)"
                      : "rgba(15,23,42,0.95)",
                    color: active ? "#111827" : "#e5e7eb",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: active
                      ? "0 0 16px rgba(250,204,21,0.8)"
                      : "none",
                  }}
                >
                  ₹ {amt}
                </button>
              );
            })}
          </div>

          {/* Custom amount box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 44,
              borderRadius: 999,
              border: "1px solid #374151",
              background: "rgba(15,23,42,0.96)",
              padding: "0 12px",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 14, marginRight: 8 }}>₹</span>
            <input
              type="number"
              placeholder="Custom amount"
              value={selectedAmount || ""}
              onChange={(e) =>
                setSelectedAmount(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              style={{
                flex: 1,
                height: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#e5e7eb",
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedAmount}
            style={{
              width: "100%",
              height: 44,
              borderRadius: 999,
              border: "none",
              background: selectedAmount
                ? "linear-gradient(135deg,#fde68a,#facc15)"
                : "#4b5563",
              color: selectedAmount ? "#111827" : "#9ca3af",
              fontWeight: 600,
              fontSize: 14,
              cursor: selectedAmount ? "pointer" : "not-allowed",
              boxShadow: selectedAmount
                ? "0 0 20px rgba(250,204,21,0.8)"
                : "none",
            }}
          >
            {selectedAmount
              ? `Deposit ₹${selectedAmount.toFixed(2)}`
              : "Select amount to deposit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DepositPage;
