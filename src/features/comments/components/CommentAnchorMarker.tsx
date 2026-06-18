import { useEffect, useRef } from 'react'

import Avatar from '../../../assets/avatar.png'
import { getRootComment, type CommentThread } from '../utils/comment-tree.util'

interface CommentAnchorMarkerProps {
  thread: CommentThread
  overlayRect: { left: number; top: number; width: number; height: number }
  active?: boolean
  onClick: (thread: CommentThread, markerElement: HTMLElement) => void
  onHover?: (thread: CommentThread, markerElement: HTMLElement) => void
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
  onHover,
  onElementChange,
}: CommentAnchorMarkerProps) {
  const markerRef = useRef<HTMLButtonElement | null>(null)
  const rootComment = getRootComment(thread.comments)
  const author = rootComment?.author
  const avatarUrl = author?.avatarUrl ?? Avatar

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
      onMouseEnter={(event) => {
        onHover?.(thread, event.currentTarget)
      }}
      onClick={(event) => {
        event.stopPropagation()
        onClick(thread, event.currentTarget)
      }}
      className={`
        pointer-events-auto absolute z-40 flex items-center justify-center overflow-hidden rounded-full border-2 bg-amber-100 text-[11px] font-semibold text-stone-800 shadow-lg transition hover:scale-105
        ${active ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-white'}
      `}
      style={{
        left: overlayRect.left,
        top: overlayRect.top,
        width: overlayRect.width,
        height: overlayRect.height,
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
