import api from '../../../shared/lib/axios';
import { LoginPayload, SignupPayload, AuthUser } from '../types/auth.type';
import authApi from '../../../shared/lib/refreshAxios';

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<{ user: AuthUser }>('/auth/login', payload),
    // Server set cả AT và RT vào cookie, response chỉ cần trả user

  signup: (payload: SignupPayload) =>
    api.post<{ message: string }>('/auth/register', payload),

  logout: () =>
    api.post('/auth/logout'),

  refreshToken: () =>
    authApi.post<{ user: AuthUser }>('/auth/refresh-token'),

  resendVerificationEmail: (email: string) => {
    api.post('/auth/resend-verification', { email }),
    console.log("authApi was called instead of api");
  },
    
  me: ()=> 
    api.get('/auth/me'),
}