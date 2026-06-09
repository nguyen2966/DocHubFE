import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GuestRoute } from './shared/components/routes/GuestRoute';
import { ProtectedRoute } from './shared/components/routes/ProtectedRoute';

import { AuthPage } from './pages/auth/AuthPage';
import { LoginForm } from './features/auth/components/LoginForm';
import { SignupForm } from './features/auth/components/SignupForm';
import { VerifyEmailPage } from './features/auth/components/VerifyEmailNotice';
import { WelcomePage } from './features/auth/components/WelcomPage';

import { WorkspaceListPage } from './pages/workspace-list/WorkspaceListPage';
import { WorkspaceLayout } from './layouts/WorkspaceLayout';
import { WorkspaceDocumentsPage } from './pages/workspace/WorkspaceDocumentPage';
import { WorkspaceMembersPage } from './pages/workspace/WorkspaceMemberPage';
import { WorkspaceActivityPage } from './pages/workspace/WorkspaceActivityPage';
import { WorkspaceSettingsPage } from './pages/workspace/WorkspaceSettingPage';
import { AcceptInvitationPage } from './layouts/AcceptInvitationPage';
import { ForrbiddenPage } from './pages/error/ForbiddenPage';
import { RequireWorkspacePermission } from './shared/components/routes/RequiredRoleRoute';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route element={<GuestRoute><AuthPage /></GuestRoute>}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/welcome" element={<WelcomePage />} />

        <Route
          path="/invitations/:token/accept"
          element={<AcceptInvitationPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route index element={<WorkspaceListPage />} />

          <Route path="/workspaces/:workspaceId" element={<WorkspaceLayout />}>
            <Route path="documents" element={<WorkspaceDocumentsPage />} />

            <Route
              path="members"
              element={
                <RequireWorkspacePermission permission="workspace:view">
                  <WorkspaceMembersPage />
                </RequireWorkspacePermission>
              }
            />

            <Route
              path="activity"
              element={
                <RequireWorkspacePermission permission="workspace:view_activity_log">
                  <WorkspaceActivityPage />
                </RequireWorkspacePermission>
              }
            />

            <Route
              path="settings"
              element={
                <RequireWorkspacePermission permission="workspace:manage_settings">
                  <WorkspaceSettingsPage />
                </RequireWorkspacePermission>
              }
            />
          </Route>

        </Route>

        <Route path="/403" element={<ForrbiddenPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;