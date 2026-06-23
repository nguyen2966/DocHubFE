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
  position: { x: number; y: number; maxHeight?: number } | null
  source: FloatingThreadSource | null
  currentUserId?: string | null
  editingCommentId?: string | null
  replyingToCommentId?: string | null
  onClose: () => void
}

const POPOVER_WIDTH = 312
const CLOSE_BUTTON_AREA_HEIGHT = 40
const MIN_GAP = 12

function clampPosition(position: { x: number; y: number; maxHeight?: number }) {
  if (typeof window === 'undefined') return position

  const maxX = window.innerWidth - POPOVER_WIDTH - MIN_GAP
  const top = Math.max(MIN_GAP, position.y)

  return {
    x: Math.max(MIN_GAP, Math.min(position.x, maxX)),
    y: top,
    maxHeight:
      position.maxHeight ??
      Math.max(180, window.innerHeight - top - MIN_GAP),
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
      const target = event.target as Node
      if (popoverRef.current.contains(target)) return
      if (
        target instanceof HTMLElement &&
        target.closest('[data-comment-action-menu]')
      ) {
        return
      }

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
        fixed z-50 w-[312px]
        ${source === 'sidebar' ? 'shadow-2xl' : ''}
      `}
      style={{
        left: safePosition.x,
        top: safePosition.y,
        maxHeight: safePosition.maxHeight,
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

      <div
        className="overflow-y-auto"
        style={{
          maxHeight: Math.max(
            140,
            (safePosition.maxHeight ?? 320) - CLOSE_BUTTON_AREA_HEIGHT,
          ),
        }}
      >
        <CommentThreadCard
          thread={thread}
          currentUserId={currentUserId}
          variant="popover"
          editingCommentId={editingCommentId}
          replyingToCommentId={replyingToCommentId}
          {...handlers}
        />
      </div>
    </div>
  )
}
