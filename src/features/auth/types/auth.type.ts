export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  fullName: string
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  fullName: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}