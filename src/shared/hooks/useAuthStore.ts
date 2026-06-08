// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { AuthUser } from '../../features/auth/types/auth.type';
// import { authService } from '../../features/auth/services/auth.service';

// interface AuthState {
//   user: AuthUser | null
//   isAuthenticated: boolean
//   setAuth: (user: AuthUser) => void
//   clearAuth: () => void
//   logout: () => Promise<void>
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       isAuthenticated: false,
//       setAuth: (user) => set({ user, isAuthenticated: true }),
//       clearAuth: () => set({ user: null, isAuthenticated: false }),
//       logout: async () => {
//         try {
//           await authService.logout()
//         } finally {
//           set({ user: null, isAuthenticated: false })
//         }
//       },
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({ user: state.user }),
//     }
//   )
// )

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '../../features/auth/types/auth.type'
import { authService } from '../../features/auth/services/auth.service'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isAuthLoading: boolean
  setAuth: (user: AuthUser) => void
  clearAuth: () => void
  initAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAuthLoading: true,

      setAuth: (user) =>
        set({
          user,
          isAuthenticated: true,
          isAuthLoading: false,
        }),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          isAuthLoading: false,
        }),

      initAuth: async () => {
        try {
          const { data } = await authService.me()
          set({
            user: data.user,
            isAuthenticated: true,
            isAuthLoading: false,
          })
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isAuthLoading: false,
          })
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isAuthLoading: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)