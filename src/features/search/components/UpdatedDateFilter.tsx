import { useEffect, useRef, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'

import type { UpdatedPreset } from '../types/document-search.type'
import { getUpdatedPresetLabel } from '../utils/search-date-filter.util'
import { UpdatedDateDropdown } from './UpdatedDateDropdown'

interface UpdatedDateFilterProps {
  value: UpdatedPreset
  onChange: (preset: UpdatedPreset) => void
}

export function UpdatedDateFilter({ value, onChange }: UpdatedDateFilterProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-48 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-stone-200 bg-white px-4 text-sm text-stone-700 transition-colors hover:bg-stone-50"
      >
        <span className="truncate">Updated: {getUpdatedPresetLabel(value)}</span>
        <CaretDown size={16} className="shrink-0 text-stone-400" />
      </button>

      {open && (
        <UpdatedDateDropdown
          value={value}
          onChange={(preset) => {
            onChange(preset)
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}
