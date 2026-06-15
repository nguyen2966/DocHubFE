import { CaretDown, Check, Users, X } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityActorOption } from '../types/activity.type';
import Avatar from '../../../assets/avatar.png';

interface ActivityActorFilterProps {
  value: string[]
  actors: ActivityActorOption[]
  onChange: (actorIds: string[]) => void
}

function getActorLabel(actor?: ActivityActorOption) {
  if (!actor) return 'Unknown user'
  return actor.fullName || actor.email
}

function getButtonLabel(selectedActors: ActivityActorOption[]) {
  if (!selectedActors.length) {
    return {
      text: 'Filter by actor',
      extra: 0,
    }
  }

  const visible = selectedActors.slice(0, 3)
  return {
    text: visible.map(getActorLabel).join(', '),
    extra: selectedActors.length - visible.length,
  }
}

export function ActivityActorFilter({
  value,
  actors,
  onChange,
}: ActivityActorFilterProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const selectedActors = useMemo(
    () => actors.filter((actor) => value.includes(actor._id)),
    [actors, value],
  )

  const selectedIdSet = useMemo(() => new Set(value), [value])
  const label = getButtonLabel(selectedActors)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return
      if (rootRef.current.contains(event.target as Node)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleActor = (actorId: string) => {
    if (selectedIdSet.has(actorId)) {
      onChange(value.filter((id) => id !== actorId))
      return
    }

    onChange([...value, actorId])
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-9 w-[300px] items-center justify-between rounded-xl border bg-white px-3 text-sm shadow-sm transition hover:bg-stone-50 ${open ? 'border-stone-300 ring-2 ring-stone-300' : 'border-stone-200'
          }`}
      >
        <span className="flex min-w-0 items-center gap-2 text-stone-700">
          <Users size={15} className="shrink-0 text-stone-600" />
          <span className="truncate">{label.text}</span>
          {label.extra > 0 && (
            <span className="shrink-0 text-stone-500">+{label.extra}</span>
          )}
        </span>

        <CaretDown size={14} className="shrink-0 text-stone-600" />
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-40 w-[300px] rounded-xl border border-stone-200 bg-white p-3 shadow-xl">
          {selectedActors.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5 rounded-lg bg-stone-50 p-2">
              {selectedActors.map((actor) => (
                <button
                  key={actor._id}
                  type="button"
                  onClick={() =>
                    onChange(value.filter((id) => id !== actor._id))
                  }
                  className="inline-flex max-w-[130px] items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-stone-800 shadow-sm ring-1 ring-stone-200 hover:bg-stone-100"
                >
                  <span className="truncate">{getActorLabel(actor)}</span>
                  <X size={12} className="shrink-0 text-stone-500" />
                </button>
              ))}
            </div>
          )}

          <div className="max-h-[280px] overflow-y-auto">
            {actors.length === 0 ? (
              <div className="px-1 py-2 text-sm text-stone-400">
                No actor found
              </div>
            ) : (
              actors.map((actor) => {
                const checked = selectedIdSet.has(actor._id)

                return (
                  <button
                    key={actor._id}
                    type="button"
                    onClick={() => toggleActor(actor._id)}
                    className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2 text-left text-sm text-stone-800 hover:bg-stone-50"
                  >
                    <span
                      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked
                          ? 'border-stone-950 bg-stone-950 text-white'
                          : 'border-stone-300 bg-white'
                        }`}
                    >
                      {checked && <Check size={12} weight="bold" />}
                    </span>

                    <img
                      src={Avatar}
                      alt={"Avatar"}
                      className="h-6 w-6 rounded-full object-cover"
                    />

                    <span className="min-w-0 flex-1 truncate">
                      {getActorLabel(actor)}
                    </span>
                  </button>
                )
              })
            )}
          </div>

          {selectedActors.length > 0 && (
            <div className="mt-3 border-t border-stone-100 pt-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-sm font-medium text-stone-500 hover:text-stone-900"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}