import { forwardRef, InputHTMLAttributes } from 'react'
import { CheckIcon } from '../../../../shared/components/icons'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, checked, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <div className="relative flex-shrink-0 mt-0.5">
          <input ref={ref} type="checkbox" className="sr-only" checked={checked} {...props} />
          <div className={`
            w-4 h-4 rounded border-2 flex items-center justify-center transition-all
            ${checked ? 'bg-stone-900 border-stone-900' : 'bg-white border-stone-300'}
          `}>
            {checked && <CheckIcon />}
          </div>
        </div>
        <span className="text-sm text-stone-600 leading-tight">{label}</span>
      </label>
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1.5 ml-6">
          <span className="inline-block w-1 h-1 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  )
)

Checkbox.displayName = 'Checkbox'