import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { signupSchema, SignupFormValues } from '../schema/signup.schema'
import { useSignup } from '../hooks/useSignup'
import { Input } from './ui/input'
import { Button } from './ui/button'
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
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1.5">Tạo tài khoản</h1>
        <p className="text-sm text-stone-500">Tham gia Lumin để cộng tác trên tài liệu nhóm.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormError message={serverError} />

        <Input
          label="Họ và tên"
          placeholder="e.g. Nguyen Van A"
          required
          error={errors.fullName?.message}
          {...register('fullName')}
        />
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
          placeholder="Tối thiểu 8 ký tự"
          required
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/*
          Checkbox dùng Controller vì react-hook-form cần
          kiểm soát checked (boolean) thay vì value (string)
        */}
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
                  Tôi đồng ý với{' '}
                  <button type="button" className="font-medium text-stone-900 hover:underline underline-offset-2">
                    Điều khoản dịch vụ
                  </button>{' '}
                  và{' '}
                  <button type="button" className="font-medium text-stone-900 hover:underline underline-offset-2">
                    Chính sách bảo mật
                  </button>
                </>
              }
            />
          )}
        />

        <Button type="submit" loading={isLoading}>
          {!isLoading && 'Đăng ký'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-medium text-stone-900 hover:underline underline-offset-2">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}