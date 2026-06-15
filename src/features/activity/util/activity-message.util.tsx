import type { ReactNode } from 'react'
import type { ActivityLog } from '../types/activity.type'

function getText(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim()
    ? value
    : fallback
}

function Strong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-stone-950">{children}</span>
}

export function getActivityMessage(log: ActivityLog): ReactNode {
  const metadata = log.metadata ?? {}

  const documentTitle = getText(
    metadata.documentTitle ?? metadata.title,
    'Untitled document',
  )

  const email = getText(
    metadata.email ?? metadata.targetUserEmail ?? metadata.revokedUserEmail,
    'a user',
  )

  switch (log.actionType) {
    case 'create_document':
      return (
        <>
          Created document <Strong>{documentTitle}</Strong>
        </>
      )

    case 'update_document': {
      const changeType = getText(metadata.changeType)

      if (changeType === 'renamed') {
        const oldTitle = getText(metadata.oldTitle, 'Untitled document')
        const newTitle = getText(metadata.newTitle, documentTitle)

        return (
          <>
            Renamed document <Strong>{oldTitle}</Strong> to{' '}
            <Strong>{newTitle}</Strong>
          </>
        )
      }

      return (
        <>
          Updated document <Strong>{documentTitle}</Strong>
        </>
      )
    }

    case 'delete_document':
      return (
        <>
          Deleted document <Strong>{documentTitle}</Strong>
        </>
      )

    case 'share_document': {
      const changeType = getText(metadata.changeType)

      if (changeType === 'access_role_updated') {
        const oldRole = getText(metadata.oldRole, 'previous role')
        const newRole = getText(metadata.newRole, 'new role')

        return (
          <>
            Changed <Strong>{email}</Strong>&apos;s role from{' '}
            <Strong>{oldRole}</Strong> to <Strong>{newRole}</Strong>
          </>
        )
      }

      return (
        <>
          Shared <Strong>{documentTitle}</Strong>
          {email !== 'a user' ? (
            <>
              {' '}
              with <Strong>{email}</Strong>
            </>
          ) : null}
        </>
      )
    }

    case 'revoke_access':
      return (
        <>
          Revoked access for <Strong>{email}</Strong>
          {documentTitle ? (
            <>
              {' '}
              on <Strong>{documentTitle}</Strong>
            </>
          ) : null}
        </>
      )

    case 'invite_user':
      return (
        <>
          Invited <Strong>{email}</Strong> to the Workspace
        </>
      )

    case 'remove_user': {
      const selfRemoved = metadata.selfRemoved === true

      if (selfRemoved) {
        return <>Left the Workspace</>
      }

      return (
        <>
          Removed <Strong>{email}</Strong> from the Workspace
        </>
      )
    }

    case 'change_user_role': {
      const oldRole = getText(metadata.oldRole)
      const newRole = getText(metadata.newRole, 'new role')

      if (oldRole) {
        return (
          <>
            Changed <Strong>{email}</Strong>&apos;s role from{' '}
            <Strong>{oldRole}</Strong> to <Strong>{newRole}</Strong>
          </>
        )
      }

      return (
        <>
          Changed <Strong>{email}</Strong>&apos;s role to{' '}
          <Strong>{newRole}</Strong>
        </>
      )
    }

    case 'update_settings':
      return <>Updated Workspace settings</>

    case 'workspace_creation': {
      const workspaceName = getText(metadata.workspaceName)

      return workspaceName ? (
        <>
          Created Workspace <Strong>{workspaceName}</Strong>
        </>
      ) : (
        <>Created Workspace</>
      )
    }

    default:
      return <>Performed an activity</>
  }
}