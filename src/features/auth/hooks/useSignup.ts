import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { SignupFormValues } from '../schema/signup.schema'

export function useSignup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null)
    setIsLoading(true)
    try {
      await authService.signup(values)

      // Giữ invitationToken trong state để WelcomePage biết cần redirect vào workspace
      // (backend claimPendingInvitations chạy tự động khi verify email,
      //  WelcomePage đọc claimedWorkspaceId từ response của /auth/me sau verify)
      const invitationToken = searchParams.get('invitationToken')

      navigate('/verify-email', {
        state: {
          email: values.email,
          invitationToken, // truyền sang VerifyEmailNotice để hiển thị hint nếu cần
        },
      })
    } catch (error: any) {
      const status = error.response?.status
      if (status === 409) setServerError('This email is already in use.')
      else setServerError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return { onSubmit, serverError, isLoading }
}