import Avatar from '../../../assets/avatar.png'
import { getRootComment, type CommentThread } from '../utils/comment-tree.util'

interface CommentAnchorMarkerProps {
  thread: CommentThread
  position: { x: number; y: number }
  active?: boolean
  onClick: (thread: CommentThread, position: { x: number; y: number }) => void
}

export function CommentAnchorMarker({
  thread,
  position,
  active,
  onClick,
}: CommentAnchorMarkerProps) {
  const rootComment = getRootComment(thread.comments)
  const author = rootComment?.author
  const avatarUrl = author?.avatarUrl ?? Avatar

  return (
    <button
      type="button"
      aria-label="Open comment thread"
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation()
        onClick(thread, position)
      }}
      className={`
        fixed z-40 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-2 bg-amber-100 text-[11px] font-semibold text-stone-800 shadow-lg transition hover:scale-105
        ${active ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-white'}
      `}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <img
        src={avatarUrl}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </button>
  )
}
