export type ActivityActionType =
  | 'create_document'
  | 'update_document'
  | 'delete_document'
  | 'share_document'
  | 'revoke_access'
  | 'invite_user'
  | 'remove_user'
  | 'change_user_role'
  | 'update_settings'
  | 'workspace_creation'

export type ActivityTargetType = 'document' | 'workspace' | 'member'

export interface ActivityActor {
  _id: string
  fullName?: string
  email: string
  avatarUrl?: string | null
}

export interface ActivityActorOption extends ActivityActor {
  activityCount?: number
  latestActivityAt?: string
}

export interface ActivityLog {
  _id: string
  workspaceId: string
  actor: ActivityActor | null
  actionType: ActivityActionType
  targetType: ActivityTargetType
  targetId: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

export interface RawActivityLog {
  _id: string
  workspaceId: string
  actor?: ActivityActor | null
  actorId?: ActivityActor | string | null
  actionType: ActivityActionType
  targetType: ActivityTargetType
  targetId: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
  updatedAt?: string
  __v?: number
}

export interface PagePaginatedMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PagePaginatedResponse<T> {
  data: T[]
  meta: PagePaginatedMeta
}

export interface DataResponse<T> {
  data: T
}

export interface ActivityDateRange {
  from?: string
  to?: string
}

export interface ActivityLogQueryParams {
  page?: number
  limit?: number
  actorIds?: string[]
  actionTypes?: ActivityActionType[]
  from?: string
  to?: string
}