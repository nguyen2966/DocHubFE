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
    <div className="flex items-center justify-between py-1.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-500">
          ?
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-stone-950">
              {user.email}
            </p>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
              Pending
            </span>
          </div>

          <p className="truncate text-sm text-stone-500">
            Unregistered user
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ShareRoleSelect
          value={user.role}
          onChange={handleRoleChange}
          disabled={updateRole.isPending}
          onRemove={() => removePending.mutate(user.shareId)}
          removeDisabled={removePending.isPending}
        />
      </div>
    </div>
  )
}
