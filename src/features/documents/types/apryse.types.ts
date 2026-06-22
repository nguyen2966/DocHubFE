import type { EditedRect, PendingCommentAnchor } from '../../comments/types/comment.type'
import type { CommentThread } from '../../comments/utils/comment-tree.util'

export interface EditedPdfExport {
  file: Blob
  editedRects: EditedRect[]
  degradedAnnotationIds: string[]
}

export interface AprysePdfViewerProps {
  fileUrl: string
  isPdfEditing: boolean

  commentThreads?: CommentThread[]
  selectedCommentAnnotationId?: string | null
  hiddenCommentAvatarMarkerId?: string | null
  commentsDisabled?: boolean
  showCommentAvatarMarkers?: boolean

  onCommentAnnotationClick?: (
    annotationId: string,
    clientPosition: { x: number; y: number },
    source?: 'marker' | 'annotation',
  ) => void
  onCommentMarkerHover?: (
    annotationId: string,
    clientPosition: { x: number; y: number },
  ) => void
  onCommentMarkerLeave?: (annotationId: string) => void

  onPendingCommentAnchorCreated?: (
    anchor: PendingCommentAnchor,
    clientPosition: { x: number; y: number },
  ) => void
}

export interface AprysePdfViewerRef {
  exportEditedPdf: () => Promise<EditedPdfExport | null>
  reloadOriginalPdf: () => void

  renderCommentThreads?: (threads: CommentThread[]) => void | Promise<void>
  scrollToCommentAnnotation?: (annotationId: string) => void | Promise<void>
  highlightCommentAnnotation?: (annotationId: string) => void
  removeTemporaryCommentAnchor?: () => void
}

export type AnyAnnotation = any
export type AnyContentEditManager = any
export type AnyContentBoxEditor = any
export type AnyQuad = {
  x1: number
  y1: number
  x2: number
  y2: number
  x3: number
  y3: number
  x4: number
  y4: number
  toRect?: () => {
    x1?: number
    y1?: number
    x2?: number
    y2?: number
    getWidth?: () => number
    getHeight?: () => number
  }
}

export type TextSelection = {
  quads: AnyQuad[]
  text: string
  pageNumber: number
  position: { x: number; y: number }
}

export type RectLike = {
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  x?: number
  y?: number
  width?: number
  height?: number
  getX1?: () => number
  getY1?: () => number
  getX2?: () => number
  getY2?: () => number
  getWidth?: () => number
  getHeight?: () => number
}

export type ApryseWebComponentElement = HTMLElement & {
  shadowRoot: ShadowRoot | null
}

export type PagePoint = {
  pageNumber: number
  x: number
  y: number
}

export type AvatarMarkerSource = 'imported-highlight' | 'annotation-position'

export type PageBoundAvatarMarker = {
  annotationId: string
  thread: CommentThread
  pageNumber: number
  anchor: { x: number; y: number }
  source: AvatarMarkerSource
}

export type OverlayRect = {
  left: number
  top: number
  width: number
  height: number
}

export type ProjectedAvatarMarker = PageBoundAvatarMarker & {
  overlayRect: OverlayRect
}
