// src/routes/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuthListener } from "../hooks/useAuthListener";

function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuthListener();

  if (authLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: "#020617",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user || !user.emailVerified) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
