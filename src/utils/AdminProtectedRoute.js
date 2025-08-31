import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const isAllowed =
    (user && user?.role === "admin") || user?.role === "manager";

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  if (!user) return null;

  return children;
};

export default AdminProtectedRoute;
