import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'

import { CreateWorkspaceModal } from '../../features/workspaces/components/CreateWorkspaceModal'
import { InviteModal } from '../../features/workspaces/components/InviteModal'
import { WorkspaceGrid } from '../../features/workspaces/components/WorkspaceGrid'
import { useWorkspaces } from '../../features/workspaces/hooks/useWorkspace'
import { Header } from '../../shared/components/Header'
import { Pagination } from '../../shared/components/Pagination'
import { Button } from '../../shared/components/ui/Button'

export function WorkspaceListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [activeInviteWorkspaceId, setActiveInviteWorkspaceId] = useState<
    string | null
  >(null)

  const { workspaces, meta, isLoading, isFetching, error } = useWorkspaces(page)

  return (
    <>
      <Header showFunctions />

      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col bg-white">
        <main className="flex min-h-[704px] w-full grow flex-col items-start p-0">
          <div className="flex w-full flex-row items-end justify-between self-stretch px-14 pb-6 pt-10">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-3xl font-bold leading-none tracking-tight text-stone-900">
                Workspace
              </h1>
              <p className="mt-1.5 text-sm text-stone-500">
                Create and manage your Workspaces
              </p>
            </div>

            <Button
              className="inline-flex items-center gap-2 whitespace-nowrap"
              onClick={() => setIsCreateOpen(true)}
              disabled={false}
            >
              <PlusIcon
                className="h-5 w-5 shrink-0 align-middle"
                aria-hidden="true"
              />
              <span className="leading-none">Create Workspace</span>
            </Button>
          </div>

          <div className="w-full px-14 py-2">
            {isLoading && (
              <p className="text-sm text-stone-500">Loading workspaces...</p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            {!isLoading && !error && (
              <>
                <WorkspaceGrid
                  workspaces={workspaces}
                  onCreateClick={() => setIsCreateOpen(true)}
                  onInviteClick={(id) => setActiveInviteWorkspaceId(id)}
                />

                <Pagination
                  meta={meta}
                  disabled={isFetching}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </main>

        <CreateWorkspaceModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />

        {activeInviteWorkspaceId && (
          <InviteModal
            workspaceId={activeInviteWorkspaceId}
            onClose={() => setActiveInviteWorkspaceId(null)}
            onInvited={() => {
              setActiveInviteWorkspaceId(null)
            }}
          />
        )}
      </div>
    </>
  )
}
