import { X } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef } from 'react'

import type { CommentThread } from '../utils/comment-tree.util'
import type {
  CommentInteractionHandlers,
  FloatingThreadSource,
} from './comment-component.type'
import { CommentThreadCard } from './CommentThreadCard'

interface CommentThreadPopoverProps extends CommentInteractionHandlers {
  open: boolean
  thread: CommentThread | null
  position: { x: number; y: number } | null
  source: FloatingThreadSource | null
  currentUserId?: string | null
  editingCommentId?: string | null
  replyingToCommentId?: string | null
  onClose: () => void
}

function clampPosition(position: { x: number; y: number }) {
  if (typeof window === 'undefined') return position

  const width = 348
  const minGap = 12
  const maxX = window.innerWidth - width - minGap

  return {
    x: Math.max(minGap, Math.min(position.x, maxX)),
    y: Math.max(minGap, position.y),
  }
}

export function CommentThreadPopover({
  open,
  thread,
  position,
  source,
  currentUserId,
  editingCommentId,
  replyingToCommentId,
  onClose,
  ...handlers
}: CommentThreadPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const safePosition = useMemo(() => {
    if (!position) return null
    return clampPosition(position)
  }, [position])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!popoverRef.current) return
      if (popoverRef.current.contains(event.target as Node)) return

      onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, onClose])

  if (!open || !thread || !safePosition) return null

  return (
    <div
      ref={popoverRef}
      className={`
        fixed z-50 w-[348px]
        ${source === 'sidebar' ? 'shadow-2xl' : ''}
      `}
      style={{
        left: safePosition.x,
        top: safePosition.y,
      }}
    >
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-stone-200 bg-white p-1.5 text-stone-500 shadow-sm hover:bg-stone-50 hover:text-stone-900"
        >
          <X size={14} />
        </button>
      </div>

      <CommentThreadCard
        thread={thread}
        currentUserId={currentUserId}
        variant="popover"
        editingCommentId={editingCommentId}
        replyingToCommentId={replyingToCommentId}
        {...handlers}
      />
    </div>
  )
}