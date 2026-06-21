import Avatar from '../../../assets/avatar.png'
import type { CommentThread } from '../utils/comment-tree.util'
import {
  getRootComment,
  isCommentDeleted,
} from '../utils/comment-tree.util'
import { TimestampTooltip } from './TimestamptToolTip'

interface CommentThreadPreviewPopoverProps {
  thread: CommentThread
  position: { x: number; y: number }
  onMouseEnter: () => void
  onMouseLeave: () => void
  onOpenThread: (thread: CommentThread) => void
}

function getPreviewText(thread: CommentThread) {
  const rootComment = getRootComment(thread.comments)

  if (!rootComment) return 'No comment'
  if (isCommentDeleted(rootComment)) return 'This comment has been deleted.'
  return rootComment.body
}

function getReplyCountLabel(thread: CommentThread) {
  const count = Math.max(0, thread.comments.length - 1)
  if (count <= 0) return null
  return `${count} ${count === 1 ? 'reply' : 'replies'}`
}

export function CommentThreadPreviewPopover({
  thread,
  position,
  onMouseEnter,
  onMouseLeave,
  onOpenThread,
}: CommentThreadPreviewPopoverProps) {
  const rootComment = getRootComment(thread.comments)
  const author = rootComment?.author
  const replyCountLabel = getReplyCountLabel(thread)

  return (
    <button
      type="button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onOpenThread(thread)}
      className="fixed z-50 w-[300px] rounded-xl border border-stone-200 bg-white p-3 text-left shadow-xl transition hover:border-stone-300"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="flex gap-2">
        <img
          src={author?.avatarUrl ?? Avatar}
          alt=""
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-semibold text-stone-900">
              {author?.fullName ?? 'Unknown user'}
            </span>
            {rootComment && <TimestampTooltip comment={rootComment} />}
          </div>

          <p className="mt-1 line-clamp-3 text-xs leading-snug text-stone-700">
            {getPreviewText(thread)}
          </p>

          {replyCountLabel && (
            <p className="mt-2 text-[11px] font-medium text-stone-400">
              {replyCountLabel}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
