import axios from 'axios';
import { useAuthStore } from '../hooks/useAuthStore';
import { authService } from '../../features/auth/services/auth.service';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,   // gửi cookie accessToken tự động
})

// Request interceptor: không cần attach accessToken thủ công vì dùng cookie

// Response interceptor: tự động refresh khi nhận 403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 403 && !original._retry) {
      original._retry = true
      try {
        // Không cần đọc/ghi token thủ công — cookie tự xử lý
        await authService.refreshToken()
        return api(original)
      } catch {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
);

export default api;