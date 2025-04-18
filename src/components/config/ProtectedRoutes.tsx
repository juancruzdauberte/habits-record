import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoutes = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;

  return <Outlet />;
};
