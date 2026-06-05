import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../shared/hooks/useAuthStore';
import { LoginFormValues } from '../schema/login.schema';


export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    setIsLoading(true)
    try {
      const { data } = await authService.login(values)
      setAuth(data.user);
      navigate('/dashboard')
    } catch (error: any) {
      const status = error.response?.status
      if (status === 401) setServerError('Incorrect email or password. Please try again.')
      else if (status === 403) setServerError('Please verify your account before log in')
      else setServerError('Error, please wait and try again')
    } finally {
      setIsLoading(false)
    }
  }

  return { onSubmit, serverError, isLoading }
}