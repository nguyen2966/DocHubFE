import type { ActivityActionType } from '../types/activity.type'

export const ACTIVITY_ACTION_LABEL: Record<ActivityActionType, string> = {
  create_document: 'Create document',
  update_document: 'Update document',
  delete_document: 'Delete document',

  share_document: 'Share document',
  revoke_access: 'Revoke access',

  invite_user: 'Invite user',
  remove_user: 'Remove user',
  change_user_role: 'Change user role',

  update_settings: 'Update settings',
  workspace_creation: 'Workspace creation',
}

export const ACTIVITY_FILTER_GROUPS: {
  title: string
  items: {
    value: ActivityActionType
    label: string
  }[]
}[] = [
  {
    title: 'Document',
    items: [
      { value: 'create_document', label: 'Create document' },
      { value: 'update_document', label: 'Update document' },
      { value: 'delete_document', label: 'Delete document' },
    ],
  },
  {
    title: 'Access & Sharing',
    items: [
      { value: 'share_document', label: 'Share document' },
      { value: 'revoke_access', label: 'Revoke access' },
    ],
  },
  {
    title: 'Workspace & Members',
    items: [
      { value: 'invite_user', label: 'Invite user' },
      { value: 'remove_user', label: 'Remove user' },
      { value: 'change_user_role', label: 'Change user role' },
      { value: 'update_settings', label: 'Update settings' },
      { value: 'workspace_creation', label: 'Workspace creation' },
    ],
  },
]

export const DEFAULT_ACTIVITY_PAGE = 1
export const DEFAULT_ACTIVITY_LIMIT = 13