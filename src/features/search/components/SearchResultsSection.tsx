import type { SearchDocumentItem } from '../types/document-search.type'
import { SearchEmptyState } from './SearchEmptyState'
import { SearchResultItem } from './SearchResultItem'

interface SearchResultsSectionProps {
  items: SearchDocumentItem[]
  query: string
  activeIndex: number
  loading: boolean
  error: boolean
  onSelect: (item: SearchDocumentItem) => void
  onActiveIndexChange: (index: number) => void
}

function SearchSkeletonRows() {
  return (
    <div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 border-b border-stone-100 px-4 py-3"
        >
          <div className="mt-1 h-5 w-5 rounded bg-stone-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-stone-100" />
            <div className="h-3 w-4/5 rounded bg-stone-100" />
            <div className="h-3 w-1/2 rounded bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SearchResultsSection({
  items,
  query,
  activeIndex,
  loading,
  error,
  onSelect,
  onActiveIndexChange,
}: SearchResultsSectionProps) {
  if (loading) return <SearchSkeletonRows />

  if (error) {
    return (
      <SearchEmptyState
        message="Could not load search results."
        description="Please try again in a moment."
      />
    )
  }

  if (items.length === 0) return <SearchEmptyState />

  return (
    <>
      {items.map((item, index) => (
        <SearchResultItem
          key={item.documentId}
          item={item}
          query={query}
          active={index === activeIndex}
          index={index}
          onSelect={() => onSelect(item)}
          onActive={() => onActiveIndexChange(index)}
        />
      ))}
    </>
  )
}
