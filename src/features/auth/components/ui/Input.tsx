import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { EyeIcon, EyeOffIcon } from '../../../../shared/components/icons'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', required, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-stone-700">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            required={required}
            className={`
              w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white
              placeholder:text-stone-400 text-stone-800
              outline-none transition-all duration-150
              ${error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100'
              }
              ${isPassword ? 'pr-10' : ''}
              ${className ?? ''}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-rose-500 flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'