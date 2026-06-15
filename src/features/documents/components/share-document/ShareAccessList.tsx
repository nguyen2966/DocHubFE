import type { DocumentAccessSummary } from '../../types/document.type'
import { WorkspaceAccessRow } from './WorkspaceAccessArrow'
import { OwnerAccessRow } from './OwnerAccessRow'
import { ExternalAccessRow } from './ExternalAccessRow'
import { PendingAccessRow } from './PendingAccessRow'

interface Props {
  access: DocumentAccessSummary
  workspaceId: string
  documentId: string
}

export function ShareAccessList({ access, workspaceId, documentId }: Props) {
  return (
    <div className="space-y-2">
      <WorkspaceAccessRow
        workspaceName={access.workspace.workspaceName}
        memberCount={access.workspace.memberCount}
      />

      {access.owner && <OwnerAccessRow owner={access.owner} />}

      {access.externalUsers.map((user) => (
        <ExternalAccessRow
          key={user.userId}
          user={user}
          workspaceId={workspaceId}
          documentId={documentId}
        />
      ))}

      {access.pendingUsers.map((user) => (
        <PendingAccessRow
          key={user.shareId}
          user={user}
          workspaceId={workspaceId}
          documentId={documentId}
        />
      ))}
    </div>
  )
}