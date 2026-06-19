import type { PagePaginatedResponse } from '../../../shared/types/pagination.type'

export type WorkspaceRole = 'admin' | 'member';

export type WorkspacePermission =
  | 'workspace:view'
  | 'workspace:create_document'
  | 'workspace:manage_settings'
  | 'workspace:invite_member'
  | 'workspace:remove_member'
  | 'workspace:change_member_role'
  | 'workspace:delete'
  | 'workspace:view_activity_log';

export interface CurrentUserWorkspaceAccess {
  role: WorkspaceRole
  scope: 'workspace'
  permissions: WorkspacePermission[]
}

export interface Workspace {
  _id: string
  name: string
  description?: string
  memberCount?: number
  currentUserAccess?: CurrentUserWorkspaceAccess
  createdAt?: string
  updatedAt?: string
}

export type WorkspaceListResponse = PagePaginatedResponse<Workspace>

export interface Member {
  _id: string
  userId: { _id: string; fullName: string; email: string }
  roleId: { name: 'admin' | 'member' }
}

export interface UserSearchResult {
  email: string
  isRegistered: boolean
  userId?: string
  fullName?: string
  isMember?: boolean
}

export interface InviteResult {
  email: string
  status: 'invited' | 'already_member' | 'already_invited' | 'error'
}
