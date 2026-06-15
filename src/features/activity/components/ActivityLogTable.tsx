import type { ActivityLog } from '../types/activity.type'
import { ActivityLogRow } from './ActivityLogRow'

interface ActivityLogTableProps {
  items: ActivityLog[]
  isLoading?: boolean
  isError?: boolean
}

function ActivityTableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <tr key={index} className="border-b border-stone-200">
          <td className="px-2 py-2">
            <div className="h-5 w-36 animate-pulse rounded bg-stone-100" />
          </td>
          <td className="px-2 py-2">
            <div className="h-5 w-80 animate-pulse rounded bg-stone-100" />
          </td>
          <td className="px-2 py-2">
            <div className="h-5 w-40 animate-pulse rounded bg-stone-100" />
          </td>
        </tr>
      ))}
    </>
  )
}

export function ActivityLogTable({
  items,
  isLoading = false,
  isError = false,
}: ActivityLogTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="w-[240px] px-2 py-3 text-sm font-medium text-stone-950">
              Actor
            </th>
            <th className="px-2 py-3 text-sm font-medium text-stone-950">
              Action
            </th>
            <th className="w-[220px] px-2 py-3 text-sm font-medium text-stone-950">
              Timestamp
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <ActivityTableSkeleton />
          ) : isError ? (
            <tr>
              <td
                colSpan={3}
                className="px-2 py-12 text-center text-sm text-red-500"
              >
                Failed to load activity logs.
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-2 py-12 text-center text-sm text-stone-500"
              >
                No activity logs found.
              </td>
            </tr>
          ) : (
            items.map((log) => <ActivityLogRow key={log._id} log={log} />)
          )}
        </tbody>
      </table>
    </div>
  )
}