import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import type { PagePaginatedMeta } from '../types/activity.type'

interface ActivityPaginationProps {
  meta?: PagePaginatedMeta
  onPageChange: (page: number) => void
  disabled?: boolean
}

function getVisiblePages(page: number, totalPages: number): Array<number | '...'> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 3) {
    return [1, 2, 3, 4, '...', totalPages]
  }

  if (page >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, '...', page - 1, page, page + 1, '...', totalPages]
}

export function ActivityPagination({
  meta,
  onPageChange,
  disabled = false,
}: ActivityPaginationProps) {
  if (!meta || meta.totalPages <= 1) return null

  const pages = getVisiblePages(meta.page, meta.totalPages)

  return (
    <div className="mt-5 flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={disabled || !meta.hasPreviousPage}
        onClick={() => onPageChange(meta.page - 1)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CaretLeft size={16} />
      </button>

      {pages.map((pageItem, index) => {
        if (pageItem === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-8 min-w-8 items-center justify-center px-2 text-sm font-medium text-stone-700"
            >
              ...
            </span>
          )
        }

        const active = pageItem === meta.page

        return (
          <button
            key={pageItem}
            type="button"
            disabled={disabled || active}
            onClick={() => onPageChange(pageItem)}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
              active
                ? 'border border-stone-200 bg-white text-stone-950 shadow-sm'
                : 'text-stone-900 hover:bg-stone-100'
            } disabled:cursor-default`}
          >
            {pageItem}
          </button>
        )
      })}

      <button
        type="button"
        disabled={disabled || !meta.hasNextPage}
        onClick={() => onPageChange(meta.page + 1)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CaretRight size={16} />
      </button>
    </div>
  )
}