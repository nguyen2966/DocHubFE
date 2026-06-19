import { Check } from '@phosphor-icons/react'

import type { SearchWorkspaceOption } from '../types/document-search.type'

interface WorkspaceFilterDropdownProps {
  options: SearchWorkspaceOption[]
  selectedWorkspaceIds: string[]
  loading: boolean
  error: boolean
  onToggleWorkspace: (workspaceId: string) => void
}

export function WorkspaceFilterDropdown({
  options,
  selectedWorkspaceIds,
  loading,
  error,
  onToggleWorkspace,
}: WorkspaceFilterDropdownProps) {
  return (
    <div className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg">
      {loading && (
        <div className="px-4 py-3 text-sm text-stone-500">
          Loading workspaces...
        </div>
      )}

      {error && (
        <div className="px-4 py-3 text-sm text-stone-500">
          Could not load workspaces.
        </div>
      )}

      {!loading && !error && options.length === 0 && (
        <div className="px-4 py-3 text-sm text-stone-500">
          No workspaces available.
        </div>
      )}

      {!loading &&
        !error &&
        options.map((workspace) => {
          const selected = selectedWorkspaceIds.includes(workspace.workspaceId)

          return (
            <label
              key={workspace.workspaceId}
              className="flex h-10 cursor-pointer items-center gap-3 px-4 text-sm text-stone-700 hover:bg-stone-50"
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggleWorkspace(workspace.workspaceId)}
                className="h-4 w-4 rounded border-stone-300"
              />
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[10px] font-semibold uppercase text-stone-500">
                {workspace.name.slice(0, 1)}
              </div>
              <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
              {selected && <Check size={14} className="text-green-600" />}
            </label>
          )
        })}
    </div>
  )
}
