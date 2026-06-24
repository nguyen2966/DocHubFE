import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CaretDown,
  Check,
  SquaresFour,
  Plus,
} from '@phosphor-icons/react';
import { useWorkspaces } from '../hooks/useWorkspace';
import { getWorkspaceAvatar } from '../../../helper/avatar-random';

export function WorkspaceSwitcher() {
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  const { workspaces, isLoading } = useWorkspaces();
  const [open, setOpen] = useState(false);


  const currentWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace._id === workspaceId),
    [workspaces, workspaceId],
  );
  

  if (isLoading) {
    return (
      <div className="h-[52px] rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full min-w-0 items-center gap-3 rounded-xl bg-stone-100 px-3 py-2 text-left transition hover:bg-stone-200"
      >
        <WorkspaceAvatar
          url={
            currentWorkspace
              ? getWorkspaceAvatar(currentWorkspace._id, currentWorkspace.name)
              : undefined
          }
          name={currentWorkspace?.name ?? 'Workspace'}
        />

        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="truncate text-sm font-semibold text-stone-950">
            {currentWorkspace?.name ?? 'Workspace'}
          </p>
          <p className="truncate text-xs capitalize text-stone-600">
            {currentWorkspace?.currentUserAccess?.role ?? 'member'}
          </p>
        </div>

        <CaretDown size={16} weight="bold" className="shrink-0 text-stone-900" />
      </button>

      {open && (
        <div className="absolute left-2 top-[calc(100%+8px)] z-[1] box-border flex h-[344px] w-[320px] flex-col items-start rounded-lg border border-[#E5E5E5] bg-white p-2 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="w-full flex-1 overflow-y-auto">
            <div className="flex w-full flex-col gap-1">
              {workspaces.map((workspace) => {
                const isActive = workspace._id === workspaceId;

                return (
                  <button
                    key={workspace._id}
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      navigate(`/workspaces/${workspace._id}/documents`)
                    }}
                    className={[
                      'flex w-full min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-left transition',
                      isActive ? 'bg-stone-100' : 'hover:bg-stone-50',
                    ].join(' ')}
                  >
                    <WorkspaceAvatar
                      url={getWorkspaceAvatar(workspace._id, workspace.name)}
                      name={workspace.name}
                    />

                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-stone-950">
                        {workspace.name}
                      </p>
                      <p className="truncate text-sm capitalize text-stone-500">
                        {workspace.currentUserAccess?.role ?? 'member'}
                      </p>
                    </div>

                    {isActive && (
                      <Check
                        size={17}
                        weight="bold"
                        className="shrink-0 text-stone-900"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="my-2 h-px w-full bg-stone-200" />

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate('/')
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-900 hover:bg-stone-50"
          >
            <SquaresFour size={18} />
            View all
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate('/')
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-900 hover:bg-stone-50"
          >
            <Plus size={18} />
            Create new Workspace
          </button>
        </div>
      )}
    </div>
  )
}

function WorkspaceAvatar({ url, name }: { url?: string; name?: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-900 text-sm font-semibold text-white">
      {url ? (
        <img
          className="h-full w-full object-cover"
          src={url}
          alt={name ?? 'Workspace'}
        />
      ) : (
        <span>{(name ?? 'W').charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}
