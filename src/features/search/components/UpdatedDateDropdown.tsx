import { Check } from '@phosphor-icons/react'

import type { UpdatedPreset } from '../types/document-search.type'
import { UPDATED_DATE_OPTIONS } from '../utils/search-date-filter.util'

interface UpdatedDateDropdownProps {
  value: UpdatedPreset
  onChange: (preset: UpdatedPreset) => void
}

export function UpdatedDateDropdown({
  value,
  onChange,
}: UpdatedDateDropdownProps) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg">
      {UPDATED_DATE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
        >
          <span>{option.label}</span>
          {value === option.value && (
            <Check size={14} className="text-green-600" />
          )}
        </button>
      ))}
    </div>
  )
}
