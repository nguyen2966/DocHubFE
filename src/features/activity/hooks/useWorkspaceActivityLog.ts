import { useQuery } from '@tanstack/react-query'
import {
  DEFAULT_ACTIVITY_LIMIT,
  DEFAULT_ACTIVITY_PAGE,
} from '../constants/activity.constants'
import { activityService } from '../services/activity.service'
import type { ActivityActionType } from '../types/activity.type'

interface UseWorkspaceActivityLogsOptions {
  workspaceId?: string
  page?: number
  limit?: number
  actorIds?: string[]
  actionTypes?: ActivityActionType[]
  from?: string
  to?: string
}

export function useWorkspaceActivityLogs({
  workspaceId,
  page = DEFAULT_ACTIVITY_PAGE,
  limit = DEFAULT_ACTIVITY_LIMIT,
  actorIds = [],
  actionTypes = [],
  from,
  to,
}: UseWorkspaceActivityLogsOptions) {
  const normalizedActorIds = [...actorIds].sort()
  const normalizedActionTypes = [...actionTypes].sort()

  return useQuery({
    queryKey: [
      'workspace-activity-logs',
      workspaceId,
      page,
      limit,
      normalizedActorIds.join(','),
      normalizedActionTypes.join(','),
      from ?? null,
      to ?? null,
    ],
    queryFn: () =>
      activityService.getWorkspaceActivityLogs(workspaceId!, {
        page,
        limit,
        actorIds: normalizedActorIds,
        actionTypes: normalizedActionTypes,
        from,
        to,
      }),
    enabled: Boolean(workspaceId),
    placeholderData: (previousData) => previousData,
  })
}