import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GuestRoute } from './shared/components/GuestRoute';
import { LoginForm } from './features/auth/components/LoginForm';
import { SignupForm } from './features/auth/components/SignupForm';
import { VerifyEmailPage } from './features/auth/components/VerifyEmailNotice';
import { AuthPage } from './pages/auth/AuthPage';
import { WelcomePage } from './features/auth/components/WelcomPage';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { DashBoardPage } from './features/dashboard/DashboardPage';
import { AcceptInvitationPage } from './layouts/AcceptInvitationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<GuestRoute><AuthPage /></GuestRoute>}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/welcome" element={<WelcomePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoardPage />} />
        </Route>

        <Route  path='/invitations/:token/accept' element={<AcceptInvitationPage/>}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
