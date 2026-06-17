import { isCommentEdited } from '../utils/comment-tree.util'
import type { Comment } from '../utils/comment-tree.util'

interface TimestampTooltipProps {
  comment: Comment
}

function formatRelativeTime(dateValue: string) {
  const date = new Date(dateValue)
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60_000))

  if (diffMinutes < 60) return `${diffMinutes} min ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

function formatFullDateTime(dateValue?: string | null) {
  if (!dateValue) return ''

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(dateValue))
}

export function TimestampTooltip({ comment }: TimestampTooltipProps) {
  const edited = isCommentEdited(comment)

  return (
    <span className="group relative inline-flex items-center">
      <span className="cursor-default text-[11px] text-stone-400">
        {formatRelativeTime(comment.createdAt)}
        {edited && <span className="ml-1 text-stone-400">(Edited)</span>}
      </span>

      <span className="invisible absolute left-1/2 top-full z-50 mt-2 w-max max-w-[260px] -translate-x-1/2 rounded-md bg-stone-950 px-3 py-2 text-[11px] leading-relaxed text-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
        {edited ? (
          <span className="block space-y-0.5">
            <span className="block">
              • Created: {formatFullDateTime(comment.createdAt)}
            </span>
            <span className="block">
              • Last edited:{' '}
              {formatFullDateTime(comment.editedAt ?? comment.updatedAt)}
            </span>
          </span>
        ) : (
          <span>{formatFullDateTime(comment.createdAt)}</span>
        )}
      </span>
    </span>
  )
}