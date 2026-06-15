import type { PendingDocumentUser, ShareRole } from '../../types/document.type'
import { useUpdatePendingDocumentShareRole } from '../../hooks/useUpdatePendingDocumentShareRole'
import { useRemovePendingDocumentShare } from '../../hooks/useRemovePendingDocumentShare'
import { ShareRoleSelect } from './ShareRoleSelect'

interface Props {
  user: PendingDocumentUser
  workspaceId: string
  documentId: string
}

export function PendingAccessRow({ user, workspaceId, documentId }: Props) {
  const updateRole = useUpdatePendingDocumentShareRole(workspaceId, documentId)
  const removePending = useRemovePendingDocumentShare(workspaceId, documentId)

  const handleRoleChange = (role: ShareRole) => {
    updateRole.mutate({ shareId: user.shareId, role })
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-500">
          ?
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-semibold text-stone-950">
              {user.email}
            </p>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-sm text-stone-500">
              Pending
            </span>
          </div>

          <p className="truncate text-base text-stone-500">
            Unregistered user
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ShareRoleSelect
          value={user.role}
          onChange={handleRoleChange}
          disabled={updateRole.isPending}
        />

        <button
          type="button"
          onClick={() => removePending.mutate(user.shareId)}
          disabled={removePending.isPending}
          className="text-sm text-stone-400 hover:text-red-500 disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  )
}