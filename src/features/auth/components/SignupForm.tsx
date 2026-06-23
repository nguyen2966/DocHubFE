import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { signupSchema, SignupFormValues } from '../schema/signup.schema'
import { useSignup } from '../hooks/useSignup'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { FormError } from './ui/FormError'
import { Checkbox } from './ui/CheckBox'


export function SignupForm() {
  const { onSubmit, serverError, isLoading } = useSignup()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { agreed: false },
  })

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1.5">Create your account</h1>
        <p className="text-sm text-stone-500">Join Folio to collaborate on your team's documents.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormError message={serverError} />

        <Input
          label="Full name"
          placeholder="e.g. John Doe"
          required
          error={errors.fullName?.message}
          {...register('fullName')}
        />
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
          placeholder="Enter a password (min. 8 characters)"
          required
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Confirm your password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Controller
          name="agreed"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={!!field.value}
              onChange={field.onChange}
              error={errors.agreed?.message}
              label={
                <>
                  I agree with{' '}
                  <button type="button" className="font-medium text-stone-900 hover:underline underline-offset-2">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="font-medium text-stone-900 hover:underline underline-offset-2">
                    Privacy Policy
                  </button>
                </>
              }
            />
          )}
        />

        <Button type="submit" loading={isLoading}>
          {!isLoading && 'Sign up'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-stone-900 hover:underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  )
}