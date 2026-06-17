import type { RefObject } from 'react'
import type { CommentThread } from '../../../comments/utils/comment-tree.util'
import type { PendingCommentAnchor } from '../../../comments/types/comment.type'
import type { AprysePdfViewerRef } from './AprysePdfViewer'
import { Document } from '../../types/document.type'
import { AprysePdfViewer } from './AprysePdfViewer'


interface DocumentViewerShellProps {
  document: Document
  isPdfEditing: boolean
  viewerRef: RefObject<AprysePdfViewerRef | null>

  commentThreads?: CommentThread[]
  selectedCommentAnnotationId?: string | null
  commentsDisabled?: boolean

  onCommentAnnotationClick?: (
    annotationId: string,
    clientPosition: { x: number; y: number },
  ) => void

  onPendingCommentAnchorCreated?: (
    anchor: PendingCommentAnchor,
    clientPosition: { x: number; y: number },
  ) => void
}

export function DocumentViewerShell({ document, isPdfEditing, viewerRef, commentThreads, selectedCommentAnnotationId, commentsDisabled, onCommentAnnotationClick, onPendingCommentAnchorCreated }: DocumentViewerShellProps) {
  if (document.processingStatus === 'processing') {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-stone-50 text-sm text-stone-500">
        Processing document...
      </div>
    )
  }

  if (
    document.processingStatus === 'failed' ||
    document.processingStatus === 'unprocessable'
  ) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-stone-50 text-sm text-red-500">
        This document cannot be processed.
      </div>
    )
  }

  if (!document.pdfFileUrl) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-stone-50 text-sm text-stone-500">
        PDF file is not available.
      </div>
    )
  }

  return <AprysePdfViewer
    ref={viewerRef}
    fileUrl={document.pdfFileUrl ?? ''}
    isPdfEditing={isPdfEditing}
    commentThreads={commentThreads}
    selectedCommentAnnotationId={selectedCommentAnnotationId}
    commentsDisabled={commentsDisabled}
    onCommentAnnotationClick={onCommentAnnotationClick}
    onPendingCommentAnchorCreated={onPendingCommentAnchorCreated}
  />
}