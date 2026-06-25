import { PlusIcon } from '@phosphor-icons/react/dist/ssr'

import { Workspace } from '../types/workspace.type'
import { WorkspaceCard } from './WorkspaceCard'

interface WorkspaceGridProps {
  workspaces: Workspace[]
  page: number
  onCreateClick: () => void
  onInviteClick: (workspaceId: string) => void
}

function CreateWorkspaceCard({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onCreateClick}
      className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-white p-6 text-center transition-all duration-200 hover:border-stone-300 hover:bg-stone-50"
      style={{ width: '328px', height: '192px', boxSizing: 'border-box' }}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-stone-100 bg-stone-50 text-stone-500 transition-colors group-hover:bg-white group-hover:text-stone-700">
        <PlusIcon className="h-5 w-5" />
      </div>
      <span className="text-sm font-medium text-stone-600 transition-colors group-hover:text-stone-900">
        Create Workspace
      </span>
    </button>
  )
}

export function WorkspaceGrid({
  workspaces,
  page,
  onCreateClick,
  onInviteClick,
}: WorkspaceGridProps) {
  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace._id}
            workspace={workspace}
            workspacePage={page}
            onInviteClick={onInviteClick}
          />
        ))}

        <CreateWorkspaceCard onCreateClick={onCreateClick} />
      </div>
    </div>
  )
}
