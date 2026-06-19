import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useSearchDocuments } from '../hooks/useSearchDocuments'
import { useSearchKeyboardNavigation } from '../hooks/useSearchKeyboardNavigation'
import { useSearchWorkspaceOptions } from '../hooks/useSearchWorkspaceOptions'
import type {
  SearchDocumentItem,
  UpdatedPreset,
} from '../types/document-search.type'
import { getUpdatedDateRange } from '../utils/search-date-filter.util'
import { RecentDocumentsSection } from './RecentDocumentsSection'
import { SearchFilterBar } from './SearchFilterBar'
import { SearchFooter } from './SearchFooter'
import { SearchInputHeader } from './SearchInputHeader'
import { SearchResultsSection } from './SearchResultsSection'

interface GlobalSearchModalProps {
  open: boolean
  onClose: () => void
}

const SEARCH_LIMIT = 20

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const resultsRef = useRef<HTMLDivElement | null>(null)
  const [query, setQuery] = useState('')
  const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState<string[]>([])
  const [updatedPreset, setUpdatedPreset] = useState<UpdatedPreset>('any')
  const [activeIndex, setActiveIndex] = useState(0)
  const debouncedQuery = useDebouncedValue(query, 300)
  const trimmedDebouncedQuery = debouncedQuery.trim()
  const hasActiveFilters =
    selectedWorkspaceIds.length > 0 || updatedPreset !== 'any'
  const isSearchMode = Boolean(trimmedDebouncedQuery || hasActiveFilters)
  const updatedRange = useMemo(
    () => getUpdatedDateRange(updatedPreset),
    [updatedPreset],
  )

  const workspaceOptionsQuery = useSearchWorkspaceOptions(open)
  const searchQuery = useSearchDocuments({
    open,
    q: trimmedDebouncedQuery,
    workspaceIds: selectedWorkspaceIds,
    updatedFrom: updatedRange.updatedFrom,
    updatedTo: updatedRange.updatedTo,
    page: 1,
    limit: SEARCH_LIMIT,
  })

  const items = searchQuery.items

  const handleSelectItem = useCallback(
    (item: SearchDocumentItem) => {
      navigate(
        `/workspaces/${item.workspace.workspaceId}/documents/${item.documentId}`,
      )
      onClose()
    },
    [navigate, onClose],
  )

  const handleSelectActive = useCallback(() => {
    const item = items[activeIndex]
    if (item) handleSelectItem(item)
  }, [activeIndex, handleSelectItem, items])

  useSearchKeyboardNavigation({
    open,
    activeIndex,
    itemCount: items.length,
    onActiveIndexChange: setActiveIndex,
    onSelectActive: handleSelectActive,
    onClose,
  })

  useEffect(() => {
    if (!open) return

    const focusId = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    return () => window.cancelAnimationFrame(focusId)
  }, [open])

  useEffect(() => {
    if (open) setActiveIndex(0)
  }, [
    open,
    trimmedDebouncedQuery,
    selectedWorkspaceIds,
    updatedPreset,
    searchQuery.dataUpdatedAt,
  ])

  useEffect(() => {
    if (activeIndex > items.length - 1) {
      setActiveIndex(Math.max(items.length - 1, 0))
    }
  }, [activeIndex, items.length])

  useEffect(() => {
    const activeElement = resultsRef.current?.querySelector<HTMLElement>(
      `[data-search-result-index="${activeIndex}"]`,
    )
    activeElement?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-20"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search documents"
        className="flex h-[520px] max-h-[calc(100vh-6rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <SearchInputHeader
          ref={inputRef}
          value={query}
          onChange={setQuery}
          onClose={onClose}
        />

        <SearchFilterBar
          workspaceOptions={workspaceOptionsQuery.data ?? []}
          selectedWorkspaceIds={selectedWorkspaceIds}
          onWorkspaceSelectionChange={setSelectedWorkspaceIds}
          workspaceLoading={workspaceOptionsQuery.isLoading}
          workspaceError={workspaceOptionsQuery.isError}
          updatedPreset={updatedPreset}
          onUpdatedPresetChange={setUpdatedPreset}
        />

        <div ref={resultsRef} className="min-h-0 flex-1 overflow-y-auto">
          {isSearchMode ? (
            <SearchResultsSection
              items={items}
              query={trimmedDebouncedQuery}
              activeIndex={activeIndex}
              loading={searchQuery.isLoading}
              error={searchQuery.isError}
              onSelect={handleSelectItem}
              onActiveIndexChange={setActiveIndex}
            />
          ) : (
            <RecentDocumentsSection
              items={items}
              activeIndex={activeIndex}
              loading={searchQuery.isLoading}
              error={searchQuery.isError}
              onSelect={handleSelectItem}
              onActiveIndexChange={setActiveIndex}
            />
          )}
        </div>

        <SearchFooter total={searchQuery.total} showCount={isSearchMode} />
      </div>
    </div>
  )
}
