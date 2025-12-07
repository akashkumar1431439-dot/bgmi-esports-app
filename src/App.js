// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/HomePage";
import TdmJoinPage from "./pages/TdmJoinPage";
import JoinedPage from "./pages/JoinedPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import DepositPage from "./pages/DepositPage";
import DepositQRPage from "./pages/DepositQRPage";
import DepositUploadPage from "./pages/DepositUploadPage";
import BottomNav from "./components/BottomNav";

// Deposit success / history placeholder page
function DepositHistoryPage() {
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
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Deposit request sent</h1>
      <p style={{ fontSize: 13, color: "#9ca3af" }}>
        Admin tumhara screenshot check karega. Agar sab sahi hua to kuch der me
        wallet balance update ho jayega.
      </p>
    </div>
  );
}

// Common layout: navbar + content + bottom nav
function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#020617",
          position: "relative",
          paddingBottom: 56,
          boxSizing: "border-box",
        }}
      >
        <Navbar />
        <div
          style={{
            minHeight: "calc(100vh - 56px)",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Home */}
      <Route
        path="/home"
        element={
          <ProtectedLayout>
            <HomePage />
          </ProtectedLayout>
        }
      />

      {/* 1v1 TDM join */}
      <Route
        path="/tournament/1v1-tdm"
        element={
          <ProtectedLayout>
            <TdmJoinPage />
          </ProtectedLayout>
        }
      />

      {/* Joined list */}
      <Route
        path="/joined"
        element={
          <ProtectedLayout>
            <JoinedPage />
          </ProtectedLayout>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <ProfilePage />
          </ProtectedLayout>
        }
      />

      {/* Deposit amount select */}
      <Route
        path="/deposit"
        element={
          <ProtectedLayout>
            <DepositPage />
          </ProtectedLayout>
        }
      />

      {/* Deposit QR */}
      <Route
        path="/deposit/qr"
        element={
          <ProtectedLayout>
            <DepositQRPage />
          </ProtectedLayout>
        }
      />

      {/* Deposit upload */}
      <Route
        path="/deposit/upload"
        element={
          <ProtectedLayout>
            <DepositUploadPage />
          </ProtectedLayout>
        }
      />

      {/* Deposit history / success */}
      <Route
        path="/deposit/history"
        element={
          <ProtectedLayout>
            <DepositHistoryPage />
          </ProtectedLayout>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
