import type { PendingDocumentUser, ShareRole } from '../../types/document.type'
import { useUpdatePendingDocumentShareRole } from '../../hooks/useUpdatePendingDocumentShareRole'
import { useRemovePendingDocumentShare } from '../../hooks/useRemovePendingDocumentShare'
import { ShareRoleSelect } from './ShareRoleSelect'
import { UserAvatar } from '../../../../shared/components/UserAvatar'

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
        <UserAvatar
          name={user.email}
          size="md"
          className="h-9 w-9 shrink-0"
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-red-500">
            Pending user
          </p>

          <p className="truncate text-sm text-stone-500">
            {user.email}
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
