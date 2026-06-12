// import { useAuthStore } from "../hooks/useAuthStore";
// import { Navigate, Outlet } from "react-router-dom";

// // ProtectedRoute.tsx
// export function ProtectedRoute() {
//   const user = useAuthStore((s) => s.user)

//   if (!user) return <Navigate to="/login" replace />
//   return <Outlet />
// }

import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../hooks/useAuthStore'

export function ProtectedRoute() {
  const location = useLocation()

  const user = useAuthStore((s) => s.user)
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading)
  const initAuth = useAuthStore((s) => s.initAuth)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  if (isAuthLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}