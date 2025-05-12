import { useContext } from "react";
import { UserContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { protect, loading } = useContext(UserContext);
  if (loading) return <div>Loading...</div>;
  return protect ? children : <Navigate to="/" replace />;
}
