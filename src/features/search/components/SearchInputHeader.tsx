import { forwardRef } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'

interface SearchInputHeaderProps {
  value: string
  onChange: (value: string) => void
  onClose: () => void
}

export const SearchInputHeader = forwardRef<
  HTMLInputElement,
  SearchInputHeaderProps
>(function SearchInputHeader({ value, onChange, onClose }, ref) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-stone-200 px-4">
      <MagnifyingGlass size={20} className="shrink-0 text-stone-400" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search documents across all workspaces..."
        data-global-search-input="true"
        className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:ring-0"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close search"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
      >
        <X size={18} />
      </button>
    </div>
  )
})
