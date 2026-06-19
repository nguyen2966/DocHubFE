import { CaretDown, Trash } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { ShareRole } from '../../types/document.type'
import {
  SHARE_ROLES,
  getShareRoleDescription,
  getShareRoleLabel,
} from '../../utils/share-role.util'

interface Props {
  value: ShareRole
  onChange: (role: ShareRole) => void
  disabled?: boolean
  variant?: 'inline' | 'row'
  onRemove?: () => void
  removeDisabled?: boolean
}

export function ShareRoleSelect({
  value,
  onChange,
  disabled,
  variant = 'row',
  onRemove,
  removeDisabled,
}: Props) {
  const [open, setOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const updateDropdownPosition = () => {
    const trigger = containerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const dropdownWidth = 288
    const viewportPadding = 12

    setDropdownPosition({
      top: rect.bottom + 8,
      left: Math.min(
        Math.max(viewportPadding, rect.right - dropdownWidth),
        window.innerWidth - dropdownWidth - viewportPadding,
      ),
    })
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!open) return

    updateDropdownPosition()

    window.addEventListener('resize', updateDropdownPosition)
    window.addEventListener('scroll', updateDropdownPosition, true)

    return () => {
      window.removeEventListener('resize', updateDropdownPosition)
      window.removeEventListener('scroll', updateDropdownPosition, true)
    }
  }, [open])

  const triggerClasses =
    variant === 'inline'
      ? 'h-8 px-2 text-sm font-semibold text-stone-900'
      : 'h-8 rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-900 shadow-sm hover:bg-stone-50'

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={[
          'inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60',
          triggerClasses,
        ].join(' ')}
      >
        <span>{getShareRoleLabel(value)}</span>
        <CaretDown size={16} className="text-stone-700" />
      </button>

      {open &&
        createPortal(
        <div
          ref={dropdownRef}
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
          }}
          className="fixed z-[100] w-72 overflow-hidden rounded-lg border border-stone-200 bg-white py-2 text-left shadow-xl"
        >
          {SHARE_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                onChange(role)
                setOpen(false)
              }}
              className={[
                'w-full px-4 py-2.5 text-left hover:bg-stone-50',
                role === value ? 'bg-stone-50' : '',
              ].join(' ')}
            >
              <span className="block text-sm font-semibold text-stone-950">
                {getShareRoleLabel(role)}
              </span>
              <span className="mt-1 block text-sm text-stone-500">
                {getShareRoleDescription(role)}
              </span>
            </button>
          ))}

          {onRemove && (
            <>
              <div className="my-2 border-t border-stone-100" />
              <button
                type="button"
                onClick={() => {
                  onRemove()
                  setOpen(false)
                }}
                disabled={removeDisabled}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash size={16} />
                Remove
              </button>
            </>
          )}
        </div>,
        document.body,
      )}
    </div>
  )
}
