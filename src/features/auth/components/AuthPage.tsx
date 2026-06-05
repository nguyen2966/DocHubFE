// features/auth/components/AuthPage.tsx
import { Outlet } from 'react-router-dom';
import { AuthLayout } from './layout/AuthLayout';

export function AuthPage() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}