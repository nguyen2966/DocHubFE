import type {
  SearchWorkspaceOption,
  UpdatedPreset,
} from '../types/document-search.type'
import { UpdatedDateFilter } from './UpdatedDateFilter'
import { WorkspaceMultiSelectFilter } from './WorkspaceMultiSelectFilter'

interface SearchFilterBarProps {
  workspaceOptions: SearchWorkspaceOption[]
  selectedWorkspaceIds: string[]
  onWorkspaceSelectionChange: (workspaceIds: string[]) => void
  workspaceLoading: boolean
  workspaceError: boolean
  updatedPreset: UpdatedPreset
  onUpdatedPresetChange: (preset: UpdatedPreset) => void
}

export function SearchFilterBar({
  workspaceOptions,
  selectedWorkspaceIds,
  onWorkspaceSelectionChange,
  workspaceLoading,
  workspaceError,
  updatedPreset,
  onUpdatedPresetChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-stone-200 px-4 py-3">
      <WorkspaceMultiSelectFilter
        options={workspaceOptions}
        selectedWorkspaceIds={selectedWorkspaceIds}
        onSelectionChange={onWorkspaceSelectionChange}
        loading={workspaceLoading}
        error={workspaceError}
      />
      <UpdatedDateFilter
        value={updatedPreset}
        onChange={onUpdatedPresetChange}
      />
    </div>
  )
}
