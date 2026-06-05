// shared/components/GuestRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

export function GuestRoute({ children }: { children: any }) {
  const user = useAuthStore((s) => s.user)
  
  if (user) return <Navigate to="/dashboard" replace />
  return children
}