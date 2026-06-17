import type { Comment, CommentThread } from '../utils/comment-tree.util'
import {
  getRootComment,
  isCommentDeleted,
  sortThreadsByNewestRoot,
} from '../utils/comment-tree.util'
import { TimestampTooltip} from './TimestamptToolTip';
import Avatar from '../../../assets/avatar.png';

interface CommentThreadListProps {
  threads: CommentThread[]
  activeAnnotationId?: string | null
  onSelectThread?: (thread: CommentThread) => void
}



function getPreview(comment: Comment | null) {
  if (!comment) return 'No comment'
  if (isCommentDeleted(comment)) return 'This comment has been deleted.'
  return comment.body
}

function formatReplyCount(count: number) {
  if (count <= 0) return null
  return `${count} ${count === 1 ? 'reply' : 'replies'}`
}

export function CommentThreadList({
  threads,
  activeAnnotationId,
  onSelectThread,
}: CommentThreadListProps) {
  const sortedThreads = sortThreadsByNewestRoot(threads)

  return (
    <div className="space-y-1 px-2 py-3">
      {sortedThreads.map((thread) => {
        const rootComment = getRootComment(thread.comments)
        const replyCount = Math.max(0, thread.comments.length - 1)
        const selected = activeAnnotationId === thread.annotation._id

        return (
          <button
            key={thread.annotation._id}
            type="button"
            onClick={() => onSelectThread?.(thread)}
            className={`
              flex w-full gap-2 rounded-lg px-2 py-2 text-left transition
              ${
                selected
                  ? 'bg-stone-100'
                  : 'hover:bg-stone-50'
              }
            `}
          >
            {rootComment ? (
              <img
                src={Avatar}
                alt={"avatar"}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-stone-200" />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-xs font-semibold text-stone-900">
                  {rootComment?.author.fullName ?? 'Unknown user'}
                </span>
                {rootComment && <TimestampTooltip comment={rootComment} />}
              </div>

              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-stone-700">
                {getPreview(rootComment)}
              </p>

              {formatReplyCount(replyCount) && (
                <p className="mt-1 text-[11px] text-stone-400">
                  {formatReplyCount(replyCount)}
                </p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}