import type { DocumentExternalUser, ShareRole } from '../../types/document.type'
import { useUpdateDocumentUserRole } from '../../hooks/useUpdateDocumentUserRole'
import { useRemoveDocumentAccess } from '../../hooks/useRemoveDocumentAccess'
import { ShareRoleSelect } from './ShareRoleSelect'

interface Props {
  user: DocumentExternalUser
  workspaceId: string
  documentId: string
}

function getInitialLabel(name: string, email: string) {
  return (name || email).charAt(0).toUpperCase()
}

export function ExternalAccessRow({ user, workspaceId, documentId }: Props) {
  const updateRole = useUpdateDocumentUserRole(workspaceId, documentId)
  const removeAccess = useRemoveDocumentAccess(workspaceId, documentId)

  const handleRoleChange = (role: ShareRole) => {
    updateRole.mutate({ userId: user.userId, role })
  }

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
          {getInitialLabel(user.fullName, user.email)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-950">
            {user.fullName}
          </p>
          <p className="truncate text-sm text-stone-500">{user.email}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ShareRoleSelect
          value={user.role}
          onChange={handleRoleChange}
          disabled={updateRole.isPending}
          onRemove={() => removeAccess.mutate(user.userId)}
          removeDisabled={removeAccess.isPending}
        />
      </div>
    </div>
  )
}
