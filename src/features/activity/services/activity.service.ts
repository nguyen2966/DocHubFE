import api from '../../../shared/lib/axios'
import type {
  ActivityActor,
  ActivityActorOption,
  ActivityLog,
  ActivityLogQueryParams,
  DataResponse,
  PagePaginatedResponse,
  RawActivityLog,
} from '../types/activity.type'

function normalizeActor(
  actor: RawActivityLog['actor'] | RawActivityLog['actorId'],
): ActivityActor | null {
  if (!actor || typeof actor === 'string') return null

  return {
    _id: actor._id,
    fullName: actor.fullName,
    email: actor.email,
    avatarUrl: actor.avatarUrl ?? null,
  }
}

function normalizeActivityLog(log: RawActivityLog): ActivityLog {
  return {
    _id: log._id,
    workspaceId: log.workspaceId,
    actor: normalizeActor(log.actor ?? log.actorId),
    actionType: log.actionType,
    targetType: log.targetType,
    targetId: log.targetId,
    metadata: log.metadata ?? {},
    createdAt: log.createdAt,
  }
}

export const activityService = {
  async getWorkspaceActivityLogs(
    workspaceId: string,
    params: ActivityLogQueryParams = {},
  ): Promise<PagePaginatedResponse<ActivityLog>> {
    const res = await api.get<PagePaginatedResponse<RawActivityLog>>(
      `/workspaces/${workspaceId}/activity-logs`,
      {
        params: {
          page: params.page,
          limit: params.limit,
          actorIds:
            params.actorIds && params.actorIds.length > 0
              ? params.actorIds.join(',')
              : undefined,
          actionTypes:
            params.actionTypes && params.actionTypes.length > 0
              ? params.actionTypes.join(',')
              : undefined,
          from: params.from,
          to: params.to,
        },
      },
    )

    return {
      data: res.data.data.map(normalizeActivityLog),
      meta: res.data.meta,
    }
  },

  async getWorkspaceActivityActors(
    workspaceId: string,
  ): Promise<ActivityActorOption[]> {
    const res = await api.get<DataResponse<ActivityActorOption[]>>(
      `/workspaces/${workspaceId}/activity-logs/actors`,
    )

    return res.data.data
  },
}