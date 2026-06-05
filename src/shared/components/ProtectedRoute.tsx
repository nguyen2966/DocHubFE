import { useAuthStore } from "../hooks/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

// ProtectedRoute.tsx
export function ProtectedRoute() {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}