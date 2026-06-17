import type { CommentThread } from '../utils/comment-tree.util'
import { countVisibleComments } from '../utils/comment-tree.util'
import { CommentEmptyState } from './CommentEmptyState'
import { CommentPanelHeader } from './CommentPanelHeader'
import { CommentThreadList } from './CommentThreadList'

interface CommentPanelProps {
  open: boolean
  threads: CommentThread[]
  activeAnnotationId?: string | null
  loading?: boolean
  onClose: () => void
  onSelectThread?: (thread: CommentThread) => void
}

export function CommentPanel({
  open,
  threads,
  activeAnnotationId,
  loading,
  onClose,
  onSelectThread,
}: CommentPanelProps) {
  if (!open) return null

  const commentCount = threads.reduce(
    (total, thread) => total + countVisibleComments(thread.comments),
    0,
  )

  return (
    <aside
      className={`
        absolute inset-y-0 right-0 z-40 w-[360px]
        flex min-h-0 flex-col
        border-r border-stone-200 bg-white shadow-xl
        transition-transform duration-200 ease-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <CommentPanelHeader count={commentCount} onClose={onClose} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3 px-4 py-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-lg bg-stone-100"
              />
            ))}
          </div>
        ) : threads.length === 0 ? (
          <CommentEmptyState />
        ) : (
          <CommentThreadList
            threads={threads}
            activeAnnotationId={activeAnnotationId}
            onSelectThread={onSelectThread}
          />
        )}
      </div>
    </aside>
  )
}