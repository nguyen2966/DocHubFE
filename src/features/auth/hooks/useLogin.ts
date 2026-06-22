import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../../../shared/hooks/useAuthStore'
import { LoginFormValues } from '../schema/login.schema'
import api from '../../../shared/lib/axios'

export function useLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    setIsLoading(true)

    try {
      const { data } = await authService.login(values)
      setAuth(data.user)

      const next = searchParams.get('next')

      if (next?.startsWith('/invitations/') && next.endsWith('/accept')) {
        const token = next.split('/')[2]

        try {
          const { data: acceptData } = await api.post<{ workspaceId: string }>(
            `/workspaces/invitations/${token}/accept`,
          )

          navigate(`/workspaces/${acceptData.workspaceId}/documents`, {
            replace: true,
          })
          return
        } catch {
          // Expired or already-used invitation: fall back to the dashboard.
        }
      }

      navigate('/', { replace: true })
    } catch (error: any) {
      const status = error.response?.status

      if (status === 401) {
        setServerError('Incorrect email or password. Please try again.')
      } else if (status === 403) {
        setServerError('Please verify your account before signing in.')
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { onSubmit, serverError, isLoading }
}
