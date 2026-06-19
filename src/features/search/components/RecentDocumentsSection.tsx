import type { SearchDocumentItem } from '../types/document-search.type'
import { SearchEmptyState } from './SearchEmptyState'
import { SearchResultItem } from './SearchResultItem'

interface RecentDocumentsSectionProps {
  items: SearchDocumentItem[]
  activeIndex: number
  loading: boolean
  error: boolean
  onSelect: (item: SearchDocumentItem) => void
  onActiveIndexChange: (index: number) => void
}

function RecentSkeletonRows() {
  return (
    <div>
      <div className="bg-stone-50 px-4 py-2 text-xs font-medium text-stone-500">
        Recent
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 border-b border-stone-100 px-4 py-3"
        >
          <div className="mt-1 h-5 w-5 rounded bg-stone-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-stone-100" />
            <div className="h-3 w-1/2 rounded bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RecentDocumentsSection({
  items,
  activeIndex,
  loading,
  error,
  onSelect,
  onActiveIndexChange,
}: RecentDocumentsSectionProps) {
  if (loading) return <RecentSkeletonRows />

  if (error) {
    return (
      <SearchEmptyState
        message="Could not load search results."
        description="Please try again in a moment."
      />
    )
  }

  if (items.length === 0) {
    return (
      <SearchEmptyState
        message="No recent documents yet."
        description="Documents you can access will appear here."
      />
    )
  }

  return (
    <>
      <div className="bg-stone-50 px-4 py-2 text-xs font-medium text-stone-500">
        Recent
      </div>
      {items.map((item, index) => (
        <SearchResultItem
          key={item.documentId}
          item={item}
          active={index === activeIndex}
          index={index}
          hideEmptyPreview
          onSelect={() => onSelect(item)}
          onActive={() => onActiveIndexChange(index)}
        />
      ))}
    </>
  )
}
