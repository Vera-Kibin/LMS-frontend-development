import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { uzytkownik } = useAuth();

  if (!uzytkownik) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(uzytkownik.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
