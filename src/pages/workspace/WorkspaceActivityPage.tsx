import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ActivityLogTable } from '../../features/activity/components/ActivityLogTable'
import { ActivityPagination } from '../../features/activity/components/ActivityPagination'
import { ActivityToolbar } from '../../features/activity/components/ActivityToolbar'
import { DEFAULT_ACTIVITY_LIMIT } from '../../features/activity/constants/activity.constants'
import { useWorkspaceActivityActors } from '../../features/activity/hooks/useWorkspaceActivityActor'
import { useWorkspaceActivityLogs } from '../../features/activity/hooks/useWorkspaceActivityLog'
import type {
  ActivityActionType,
  ActivityDateRange,
} from '../../features/activity/types/activity.type'

export function WorkspaceActivityPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()

  const [page, setPage] = useState(1)
  const [actorIds, setActorIds] = useState<string[]>([])
  const [actionTypes, setActionTypes] = useState<ActivityActionType[]>([])
  const [dateRange, setDateRange] = useState<ActivityDateRange>({})

  const actorsQuery = useWorkspaceActivityActors(workspaceId)

  const logsQuery = useWorkspaceActivityLogs({
    workspaceId,
    page,
    limit: DEFAULT_ACTIVITY_LIMIT,
    actorIds,
    actionTypes,
    from: dateRange.from,
    to: dateRange.to,
  })

  const resetToFirstPage = () => {
    setPage(1)
  }

  if (!workspaceId) {
    return (
      <div className="text-sm text-red-500">
        Workspace ID is missing.
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-stone-950">
          Activity log
        </h1>
      </div>

      <ActivityToolbar
        actorIds={actorIds}
        actors={actorsQuery.data ?? []}
        onActorIdsChange={(nextActorIds) => {
          setActorIds(nextActorIds)
          resetToFirstPage()
        }}
        actionTypes={actionTypes}
        onActionTypesChange={(nextActions) => {
          setActionTypes(nextActions)
          resetToFirstPage()
        }}
        dateRange={dateRange}
        onDateRangeChange={(nextDateRange) => {
          setDateRange(nextDateRange)
          resetToFirstPage()
        }}
      />

      <ActivityLogTable
        items={logsQuery.data?.data ?? []}
        isLoading={logsQuery.isLoading}
        isError={logsQuery.isError}
      />

      <ActivityPagination
        meta={logsQuery.data?.meta}
        disabled={logsQuery.isFetching}
        onPageChange={setPage}
      />
    </div>
  )
}