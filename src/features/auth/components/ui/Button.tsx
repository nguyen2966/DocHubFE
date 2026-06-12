import { ButtonHTMLAttributes } from 'react'
import { SpinnerIcon } from '../../../../shared/components/ui/icons'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export function Button({ children, loading, disabled, className, ...props }: ButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={`
        w-full py-2.5 px-4 rounded-lg text-sm font-semibold
        bg-stone-900 text-white
        hover:bg-stone-700 active:bg-stone-800
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-all duration-150
        flex items-center justify-center gap-2
        ${className ?? ''}
      `}
      {...props}
    >
      {loading && <SpinnerIcon />}
      {children}
    </button>
  )
}