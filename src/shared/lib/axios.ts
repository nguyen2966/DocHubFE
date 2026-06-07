// import axios from 'axios'
// import { useAuthStore } from '../hooks/useAuthStore'
// import { authService } from '../../features/auth/services/auth.service'

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const original = error.config

//     if (error.response?.status === 401 && !original._retry) {
//       original._retry = true

//       try {
//         await authService.refreshToken();
//         return api(original);
//       } catch {
//         useAuthStore.getState().clearAuth();
//         window.location.href = '/login';
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default api;

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../hooks/useAuthStore'
import { authService } from '../../features/auth/services/auth.service'

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

let refreshPromise: Promise<unknown> | null = null

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryAxiosRequestConfig | undefined

    if (!original) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = authService.refreshToken().finally(() => {
          refreshPromise = null
        })
      }

      await refreshPromise

      return api(original)
    } catch (refreshError) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    }
  },
)

export default api