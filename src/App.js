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
          <ProtectedRoute>
            <>
              <Navbar />
              <HomePage />
            </>
          </ProtectedRoute>
        }
      />

      {/* 1v1 TDM join */}
      <Route
        path="/tournament/1v1-tdm"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <TdmJoinPage />
            </>
          </ProtectedRoute>
        }
      />

      {/* Joined list */}
      <Route
        path="/joined"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <JoinedPage />
            </>
          </ProtectedRoute>
        }
      />

      {/* Profile page */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <ProfilePage />
            </>
          </ProtectedRoute>
        }
      />

      {/* Deposit amount select page */}
      <Route
        path="/deposit"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <DepositPage />
            </>
          </ProtectedRoute>
        }
      />

      {/* QR page (Step 2) */}
      <Route
        path="/deposit/qr"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <DepositQRPage />
            </>
          </ProtectedRoute>
        }
      />

      {/* Upload details page (Step 3) */}
      <Route
        path="/deposit/upload"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <DepositUploadPage />
            </>
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
