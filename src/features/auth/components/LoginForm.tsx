import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { loginSchema, LoginFormValues } from '../schema/login.schema'
import { useLogin } from '../hooks/useLogin'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { FormError } from './ui/FormError'

export function LoginForm() {
  const { onSubmit, serverError, isLoading } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1.5">Đăng nhập</h1>
        <p className="text-sm text-stone-500">Chào mừng trở lại. Vui lòng nhập thông tin.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormError message={serverError} />

        <Input
          label="Email"
          type="email"
          placeholder="name@company.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-end -mt-1">
          <button
            type="button"
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            Quên mật khẩu?
          </button>
        </div>

        <Button type="submit" loading={isLoading}>
          {!isLoading && 'Đăng nhập'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Chưa có tài khoản?{' '}
        <Link to="/signup" className="font-medium text-stone-900 hover:underline underline-offset-2">
          Đăng ký
        </Link>
      </p>
    </div>
  )
}