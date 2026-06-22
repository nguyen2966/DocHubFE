import api from '../../../shared/lib/axios';
import authApi from '../../../shared/lib/refreshAxios';
import type {
  AuthUser,
  LoginPayload,
  SignupPayload,
  VerifyEmailResponse,
} from '../types/auth.type';

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<{ user: AuthUser }>('/auth/login', payload),

  signup: (payload: SignupPayload) =>
    api.post<{ message: string }>('/auth/register', payload),

  verifyEmail: (token: string) =>
    api.post<VerifyEmailResponse>('/auth/verify-email', { token }),

  logout: () => api.post('/auth/logout'),

  refreshToken: () =>
    authApi.post<{ message: string }>('/auth/refresh-token'),

  resendVerificationEmail: (email: string) =>
    api.post('/auth/resend-verification', { email }),

  me: () => api.get<{ user: AuthUser }>('/auth/me'),

  meNoRefresh: () =>
    authApi.get('/auth/me'),
}
