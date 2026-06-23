import type { CommentThread } from '../utils/comment-tree.util'
import { CommentAnchorMarker } from './CommentAnchorMarker'
import { SelectionCommentAction } from './SelectionCommentAction'

export interface CommentMarkerOverlay {
  annotationId: string
  thread: CommentThread
  pageNumber: number
  source: 'imported-highlight' | 'annotation-position'
  pageRect: { x: number; y: number; width: number; height: number }
  overlayRect: { left: number; top: number; width: number; height: number }
}

interface CommentAnnotationOverlayLayerProps {
  selectionActionPosition: { x: number; y: number } | null
  markers: CommentMarkerOverlay[]
  activeAnnotationId?: string | null
  hiddenAnnotationId?: string | null
  hidden?: boolean
  onAddComment: () => void | Promise<void>
  onMarkerClick: (
    thread: CommentThread,
    markerElement: HTMLElement,
  ) => void
  onMarkerElementChange?: (
    thread: CommentThread,
    markerElement: HTMLElement | null,
  ) => void
}

export function CommentAnnotationOverlayLayer({
  selectionActionPosition,
  markers,
  activeAnnotationId,
  hiddenAnnotationId,
  hidden,
  onAddComment,
  onMarkerClick,
  onMarkerElementChange,
}: CommentAnnotationOverlayLayerProps) {
  if (hidden) return null

  return (
    <>
      {selectionActionPosition && (
        <SelectionCommentAction
          position={selectionActionPosition}
          onClick={onAddComment}
        />
      )}

      {markers
        .filter((marker) => marker.thread.annotation._id !== hiddenAnnotationId)
        .map((marker) => (
          <CommentAnchorMarker
            key={marker.thread.annotation._id}
            thread={marker.thread}
            overlayRect={marker.overlayRect}
            active={activeAnnotationId === marker.thread.annotation._id}
            onClick={onMarkerClick}
            onElementChange={onMarkerElementChange}
          />
        ))}
    </>
  )
}
