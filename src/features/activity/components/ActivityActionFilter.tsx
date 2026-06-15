import {
  Buildings,
  CaretDown,
  Check,
  FileText,
  Gear,
  PencilSimple,
  ShareNetwork,
  Trash,
  UserGear,
  UserMinus,
  UserPlus,
  X,
} from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ACTIVITY_ACTION_LABEL,
  ACTIVITY_FILTER_GROUPS,
} from '../constants/activity.constants';
import type { ActivityActionType } from '../types/activity.type';
import type { ComponentType } from 'react';
import type { IconProps } from '@phosphor-icons/react';

interface ActivityActionFilterProps {
  value: ActivityActionType[]
  onChange: (value: ActivityActionType[]) => void
}

const ACTION_ICON_MAP: Record<ActivityActionType, ComponentType<IconProps>> = {
  create_document: FileText,
  update_document: PencilSimple,
  delete_document: Trash,

  share_document: ShareNetwork,
  revoke_access: UserMinus,

  invite_user: UserPlus,
  remove_user: UserMinus,
  change_user_role: UserGear,

  update_settings: Gear,
  workspace_creation: Buildings,
}

function ActionOptionIcon({ actionType }: { actionType: ActivityActionType }) {
  const Icon = ACTION_ICON_MAP[actionType]

  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-500">
      <Icon size={13} weight="regular" />
    </span>
  )
}

function getButtonLabel(value: ActivityActionType[]) {
  if (!value.length) {
    return {
      text: 'All actions',
      extra: 0,
    }
  }

  const visible = value.slice(0, 2)
  return {
    text: visible.map((item) => ACTIVITY_ACTION_LABEL[item]).join(', '),
    extra: value.length - visible.length,
  }
}

export function ActivityActionFilter({
  value,
  onChange,
}: ActivityActionFilterProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const selectedSet = useMemo(() => new Set(value), [value])
  const label = getButtonLabel(value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return
      if (rootRef.current.contains(event.target as Node)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleAction = (action: ActivityActionType) => {
    if (selectedSet.has(action)) {
      onChange(value.filter((item) => item !== action))
      return
    }

    onChange([...value, action])
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-9 w-[260px] items-center justify-between rounded-xl border bg-white px-3 text-sm shadow-sm transition hover:bg-stone-50 ${
          open ? 'border-stone-300 ring-2 ring-stone-300' : 'border-stone-200'
        }`}
      >
        <span className="min-w-0 truncate text-stone-700">{label.text}</span>

        <span className="flex shrink-0 items-center gap-2">
          {label.extra > 0 && (
            <span className="text-stone-500">+{label.extra}</span>
          )}
          <CaretDown size={14} className="text-stone-600" />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-40 w-[280px] rounded-xl border border-stone-200 bg-white p-3 shadow-xl">
          {value.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5 rounded-lg bg-stone-50 p-2">
              {value.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() =>
                    onChange(value.filter((item) => item !== action))
                  }
                  className="inline-flex max-w-[150px] items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-stone-800 shadow-sm ring-1 ring-stone-200 hover:bg-stone-100"
                >
                  <span className="truncate">{ACTIVITY_ACTION_LABEL[action]}</span>
                  <X size={12} className="shrink-0 text-stone-500" />
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => onChange([])}
            className="mb-2 w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            All actions
          </button>

          <div className="space-y-3">
            {ACTIVITY_FILTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="mb-1 px-2 text-xs font-medium text-stone-400">
                  {group.title}
                </p>

                {group.items.map((item) => {
                  const checked = selectedSet.has(item.value)

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => toggleAction(item.value)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-stone-800 hover:bg-stone-50"
                    >
                      <span
                        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          checked
                            ? 'border-stone-950 bg-stone-950 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {checked && <Check size={12} weight="bold" />}
                      </span>
                      
                      <ActionOptionIcon actionType={item.value} />

                      {item.label}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}