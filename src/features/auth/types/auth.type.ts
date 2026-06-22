export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  fullName: string
  email: string
  password: string
  invitationToken?: string | null
}

export interface AuthUser {
  _id: string
  email: string
  fullName: string
}

export interface VerifyEmailResponse {
  user: AuthUser
  redirectTo: string
  sessionStarted: boolean
}
