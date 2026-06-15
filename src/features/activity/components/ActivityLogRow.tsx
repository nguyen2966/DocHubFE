import type { ActivityLog } from '../types/activity.type';
import { formatActivityTimestamp } from '../util/activity-date.util';
import { getActivityMessage } from '../util/activity-message.util';
import { ActivityActionIcon } from './ActivityActionIcon';
import Avatar from '../../../assets/avatar.png'

interface ActivityLogRowProps {
  log: ActivityLog
}

function getActorName(log: ActivityLog) {
  return log.actor?.fullName || log.actor?.email || 'Unknown user'
}

export function ActivityLogRow({ log }: ActivityLogRowProps) {
  const actorName = getActorName(log)

  return (
    <tr className="border-b border-stone-200 last:border-b-0">
      <td className="w-[240px] px-2 py-2 align-middle">
        <div className="flex min-w-0 items-center gap-2">
            <img
              src={Avatar}
              alt={actorName}
              className="h-5 w-5 rounded-full object-cover"
            />
        

          <span className="truncate text-sm font-medium text-stone-950">
            {actorName}
          </span>
        </div>
      </td>

      <td className="px-2 py-2 align-middle">
        <div className="flex min-w-0 items-center gap-2 text-sm text-stone-900">
          <ActivityActionIcon actionType={log.actionType} />
          <span className="min-w-0 truncate">{getActivityMessage(log)}</span>
        </div>
      </td>

      <td className="w-[220px] px-2 py-2 align-middle text-sm text-stone-900">
        {formatActivityTimestamp(log.createdAt)}
      </td>
    </tr>
  )
}