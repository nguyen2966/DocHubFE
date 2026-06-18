import type { CommentThread } from '../utils/comment-tree.util'
import { CommentAnchorMarker } from './CommentAnchorMarker'
import { SelectionCommentAction } from './SelectionCommentAction'

export interface CommentMarkerOverlay {
  thread: CommentThread
  pageNumber: number
  pageRect: { x: number; y: number; width: number; height: number }
  overlayRect: { x: number; y: number; width: number; height: number }
  position: { x: number; y: number }
}

interface CommentAnnotationOverlayLayerProps {
  selectionActionPosition: { x: number; y: number } | null
  markers: CommentMarkerOverlay[]
  activeAnnotationId?: string | null
  hidden?: boolean
  onAddComment: () => void | Promise<void>
  onMarkerClick: (
    thread: CommentThread,
    markerElement: HTMLElement,
  ) => void
  onMarkerHover?: (
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
  hidden,
  onAddComment,
  onMarkerClick,
  onMarkerHover,
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

      {markers.map((marker) => (
        <CommentAnchorMarker
          key={marker.thread.annotation._id}
          thread={marker.thread}
          position={marker.position}
          active={activeAnnotationId === marker.thread.annotation._id}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
          onElementChange={onMarkerElementChange}
        />
      ))}
    </>
  )
}
