import { useEffect, useMemo, useRef, useState } from 'react'
import { BuildingOffice, CaretDown } from '@phosphor-icons/react'

import type { SearchWorkspaceOption } from '../types/document-search.type'
import { WorkspaceFilterDropdown } from './WorkspaceFilterDropdown'

interface WorkspaceMultiSelectFilterProps {
  options: SearchWorkspaceOption[]
  selectedWorkspaceIds: string[]
  onSelectionChange: (workspaceIds: string[]) => void
  loading: boolean
  error: boolean
}

export function WorkspaceMultiSelectFilter({
  options,
  selectedWorkspaceIds,
  onSelectionChange,
  loading,
  error,
}: WorkspaceMultiSelectFilterProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const optionById = useMemo(
    () => new Map(options.map((option) => [option.workspaceId, option])),
    [options],
  )

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

  const selectedNames = selectedWorkspaceIds
    .map((workspaceId) => optionById.get(workspaceId)?.name)
    .filter(Boolean) as string[]
  const label =
    selectedNames.length === 0
      ? 'Filter by Workspace'
      : selectedNames.length <= 3
        ? selectedNames.join(', ')
        : `${selectedNames.slice(0, 3).join(', ')} +${
            selectedNames.length - 3
          }`

  const handleToggleWorkspace = (workspaceId: string) => {
    if (selectedWorkspaceIds.includes(workspaceId)) {
      onSelectionChange(
        selectedWorkspaceIds.filter((selectedId) => selectedId !== workspaceId),
      )
      return
    }

    onSelectionChange([...selectedWorkspaceIds, workspaceId])
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-stone-200 bg-white px-4 text-sm transition-colors hover:bg-stone-50"
      >
        <span className="flex min-w-0 items-center gap-2 text-stone-700">
          <BuildingOffice size={16} className="shrink-0 text-stone-400" />
          <span className="truncate">{label}</span>
        </span>
        <CaretDown size={16} className="shrink-0 text-stone-400" />
      </button>

      {open && (
        <WorkspaceFilterDropdown
          options={options}
          selectedWorkspaceIds={selectedWorkspaceIds}
          loading={loading}
          error={error}
          onToggleWorkspace={handleToggleWorkspace}
        />
      )}
    </div>
  )
}
