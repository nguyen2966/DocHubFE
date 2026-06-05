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
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1.5">Welcome back</h1>
        <p className="text-sm text-stone-500">Sign in to access your Workspaces and documents.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormError message={serverError} />

        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          error={errors.password?.message}
          {...register('password')}
        />


        <Button type="submit" loading={isLoading}>
          {!isLoading && 'Đăng nhập'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        New to Folio?{' '}
        <Link to="/signup" className="font-medium text-stone-900 hover:underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </div>
  )
}