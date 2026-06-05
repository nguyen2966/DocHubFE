import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { SignupFormValues } from '../schema/signup.schema'

export function useSignup() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null)
    setIsLoading(true)
    try {
      await authService.signup(values)
      // Không login ngay — redirect sang trang thông báo verify email
      navigate('/verify-email', { state: { email: values.email } })
    } catch (error: any) {
      const status = error.response?.status
      if (status === 409) setServerError('Email này đã được sử dụng')
      else setServerError('Đã có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return { onSubmit, serverError, isLoading }
}