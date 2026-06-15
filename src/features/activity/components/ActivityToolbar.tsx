import type {
  ActivityActionType,
  ActivityActorOption,
  ActivityDateRange,
} from '../types/activity.type'
import { ActivityActionFilter } from './ActivityActionFilter'
import { ActivityActorFilter } from './ActivityActorFilter'
import { ActivityDateRangeFilter } from './ActivityDateRangeFilter'

interface ActivityToolbarProps {
  actorIds: string[]
  actors: ActivityActorOption[]
  onActorIdsChange: (actorIds: string[]) => void

  actionTypes: ActivityActionType[]
  onActionTypesChange: (actions: ActivityActionType[]) => void

  dateRange: ActivityDateRange
  onDateRangeChange: (value: ActivityDateRange) => void
}

export function ActivityToolbar({
  actorIds,
  actors,
  onActorIdsChange,
  actionTypes,
  onActionTypesChange,
  dateRange,
  onDateRangeChange,
}: ActivityToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <ActivityActorFilter
        value={actorIds}
        actors={actors}
        onChange={onActorIdsChange}
      />

      <ActivityActionFilter
        value={actionTypes}
        onChange={onActionTypesChange}
      />

      <ActivityDateRangeFilter
        value={dateRange}
        onChange={onDateRangeChange}
      />
    </div>
  )
}