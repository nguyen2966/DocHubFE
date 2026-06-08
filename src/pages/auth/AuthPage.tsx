// features/auth/components/AuthPage.tsx
import { Outlet } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';

export function AuthPage() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}