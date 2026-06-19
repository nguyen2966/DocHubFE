import type { ButtonHTMLAttributes } from 'react'

type SearchButtonVariant = 'default' | 'outline' | 'ghost'
type SearchButtonSize = 'default' | 'sm' | 'icon'

interface SearchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: SearchButtonVariant
  size?: SearchButtonSize
}

const variantClasses: Record<SearchButtonVariant, string> = {
  default: 'bg-stone-900 text-white hover:bg-stone-800',
  outline:
    'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50',
  ghost: 'text-stone-600 hover:bg-stone-100',
}

const sizeClasses: Record<SearchButtonSize, string> = {
  default: 'h-8 px-3',
  sm: 'h-7 px-2.5 text-xs',
  icon: 'h-8 w-8',
}

export function Button({
  className = '',
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}: SearchButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    />
  )
}
