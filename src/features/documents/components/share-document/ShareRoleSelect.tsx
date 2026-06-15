import { CaretDown } from '@phosphor-icons/react'
import type { ShareRole } from '../../types/document.type'
import { SHARE_ROLES, getShareRoleLabel } from '../../utils/share-role.util'

interface Props {
  value: ShareRole
  onChange: (role: ShareRole) => void
  disabled?: boolean
  variant?: 'inline' | 'row'
}

export function ShareRoleSelect({
  value,
  onChange,
  disabled,
  variant = 'row',
}: Props) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as ShareRole)}
        className={[
          'appearance-none bg-transparent pr-7 text-base outline-none disabled:cursor-not-allowed disabled:opacity-60',
          variant === 'inline'
            ? 'font-semibold text-stone-900'
            : 'font-medium text-stone-900',
        ].join(' ')}
      >
        {SHARE_ROLES.map((role) => (
          <option key={role} value={role}>
            {getShareRoleLabel(role)}
          </option>
        ))}
      </select>

      <CaretDown
        size={16}
        className="pointer-events-none absolute right-0 text-stone-700"
      />
    </div>
  )
}