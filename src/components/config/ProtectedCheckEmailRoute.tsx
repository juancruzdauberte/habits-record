import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedCheckEmailRoute = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { hasRequestedMagicLink } = useAuth();
  return hasRequestedMagicLink ? children : <Navigate to="/" />;
};
