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
      const invitationToken = searchParams.get('invitationToken')

      await authService.signup({
        ...values,
        invitationToken,
      })

      navigate('/verify-email', {
        state: {
          email: values.email,
        },
      })
    } catch (error: any) {
      const status = error.response?.status

      if (status === 409) {
        setServerError('This email is already in use.')
      } else if (status === 400 || status === 403) {
        setServerError(
          error.response?.data?.message ??
            'This invitation cannot be used with that email.',
        )
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { onSubmit, serverError, isLoading }
}
