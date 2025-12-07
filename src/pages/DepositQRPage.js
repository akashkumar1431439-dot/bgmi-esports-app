import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function DepositQRPage() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const query = useQuery();
  const amount = Number(query.get("amount") || 0);

  if (!user) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 56px)",
          backgroundImage: "url('/images/scanpay_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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

  const handlePaid = () => {
    navigate(`/deposit/upload?amount=${amount}`);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        backgroundImage: "url('/images/scanpay_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#e5e7eb",
        padding: "24px 40px",
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Scan &amp; pay</h1>

      <div
        style={{
          maxWidth: 460,
          padding: 20,
          borderRadius: 18,
          background: "rgba(2, 6, 23, 0.9)",
          border: "1px solid #1f2937",
        }}
      >
        <p style={{ fontSize: 13, marginBottom: 8, color: "#9ca3af" }}>
          Please pay <strong>₹{amount}</strong> to the below UPI‑QR. Payment sirf
          is QR / UPI ID par hi kare.
        </p>

        {/* UPI QR IMAGE */}
        <img
          src="/images/my-upi-qr.png"
          alt="UPI QR"
          style={{
            width: 220,
            height: 220,
            borderRadius: 16,
            background: "#000",
            objectFit: "cover",
            display: "block",
            marginBottom: 10,
          }}
        />

        <p
          style={{
            fontSize: 12,
            color: "#9ca3af",
            marginBottom: 16,
          }}
        >
          Payment complete hone ke baad UPI screen ka{" "}
          <strong>clear screenshot</strong> le lo. Next step me app tumse ye
          screenshot / details mangega.
        </p>

        <button
          type="button"
          onClick={handlePaid}
          style={{
            width: "100%",
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
          I have paid, continue
        </button>
      </div>
    </div>
  );
}

export default DepositQRPage;
