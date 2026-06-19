import { File } from '@phosphor-icons/react'

import type { SearchDocumentItem } from '../types/document-search.type'
import { formatSearchUpdatedTime } from '../utils/format-search-updated-time.util'
import { HighlightedText } from './HighlightedText'

interface SearchResultItemProps {
  item: SearchDocumentItem
  query?: string
  active: boolean
  index: number
  hideEmptyPreview?: boolean
  onSelect: () => void
  onActive: () => void
}

export function SearchResultItem({
  item,
  query,
  active,
  index,
  hideEmptyPreview = false,
  onSelect,
  onActive,
}: SearchResultItemProps) {
  const updatedLabel = formatSearchUpdatedTime(item.updatedAt)

  return (
    <button
      type="button"
      data-search-result-index={index}
      onClick={onSelect}
      onMouseEnter={onActive}
      className={`flex w-full items-start gap-3 border-b border-stone-100 px-4 py-2.5 text-left transition-colors hover:bg-stone-50 ${
        active ? 'bg-stone-100' : 'bg-white'
      }`}
    >
      <File size={20} className="mt-1 shrink-0 text-stone-400" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-stone-900">
          <HighlightedText text={item.title} query={query} />
        </div>
        {(!hideEmptyPreview || item.previewText) && (
          <div className="mt-1 line-clamp-1 text-xs text-stone-500">
            <HighlightedText text={item.previewText} query={query} />
          </div>
        )}
        <div className="mt-1 truncate text-xs text-stone-400">
          {item.workspace.name}
          {updatedLabel ? ` · Updated ${updatedLabel}` : ''}
        </div>
      </div>
    </button>
  )
}
