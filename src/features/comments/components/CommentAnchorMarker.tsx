import { useEffect, useRef } from 'react'

import { UserAvatar } from '../../../shared/components/UserAvatar'
import { getRootComment, type CommentThread } from '../utils/comment-tree.util'

interface CommentAnchorMarkerProps {
  thread: CommentThread
  overlayRect: { left: number; top: number; width: number; height: number }
  active?: boolean
  onClick: (thread: CommentThread, markerElement: HTMLElement) => void
  onElementChange?: (
    thread: CommentThread,
    markerElement: HTMLElement | null,
  ) => void
}

export function CommentAnchorMarker({
  thread,
  overlayRect,
  active,
  onClick,
  onElementChange,
}: CommentAnchorMarkerProps) {
  const markerRef = useRef<HTMLButtonElement | null>(null)
  const rootComment = getRootComment(thread.comments)
  const author = rootComment?.author
  const markerSize = Math.max(overlayRect.width, overlayRect.height, 46)
  const markerLeft = overlayRect.left - (markerSize - overlayRect.width) / 2
  const markerTop = overlayRect.top - (markerSize - overlayRect.height) / 2

  useEffect(() => {
    const markerElement = markerRef.current

    if (markerElement) {
      onElementChange?.(thread, markerElement)
    }

    return () => {
      onElementChange?.(thread, null)
    }
  }, [onElementChange, thread])

  return (
    <button
      ref={markerRef}
      type="button"
      aria-label="Open comment thread"
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation()
        onClick(thread, event.currentTarget)
      }}
      className={`
        pointer-events-auto absolute z-40 flex items-center justify-center bg-white p-[7px] text-[11px] font-semibold text-stone-800 shadow-[0_10px_24px_rgba(15,23,42,0.22)] transition hover:scale-105
        ${active ? 'ring-2 ring-blue-500/60' : ''}
      `}
      style={{
        left: markerLeft,
        top: markerTop,
        width: markerSize,
        height: markerSize,
        borderRadius: '9999px 9999px 9999px 12px',
      }}
    >
      <UserAvatar
        src={author?.avatarUrl}
        name={author?.fullName}
        size="md"
        className="h-full w-full"
      />
    </button>
  )
}
