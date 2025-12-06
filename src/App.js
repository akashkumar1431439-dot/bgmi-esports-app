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

// Common layout for all protected pages (Navbar + content wrapper)
function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#020617",
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

      {/* Profile page */}
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <ProfilePage />
          </ProtectedLayout>
        }
      />

      {/* Deposit amount select page */}
      <Route
        path="/deposit"
        element={
          <ProtectedLayout>
            <DepositPage />
          </ProtectedLayout>
        }
      />

      {/* QR page (Step 2) */}
      <Route
        path="/deposit/qr"
        element={
          <ProtectedLayout>
            <DepositQRPage />
          </ProtectedLayout>
        }
      />

      {/* Upload details page (Step 3) */}
      <Route
        path="/deposit/upload"
        element={
          <ProtectedLayout>
            <DepositUploadPage />
          </ProtectedLayout>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
