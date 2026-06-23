

import { type ReactNode, useMemo, useRef, useState } from 'react'

import { CommentComposer } from '../../../comments/components/CommentComposer'
import { CommentPanel } from '../../../comments/components/CommentPanel'
import { CommentThreadPreviewPopover } from '../../../comments/components/CommentThreadPreviewPopOver'
import { CommentThreadPopover } from '../../../comments/components/CommentThreadPopover'
import { DeleteThreadConfirmModal } from '../../../comments/components/DeleteThreadConfirmModal'
import { DeleteCommentConfirmModal } from '../../../comments/components/DeleteCommentConfirmModal'
import { useCommentThreads } from '../../../comments/hooks/useCommentThread'
import { useCreateCommentReply } from '../../../comments/hooks/useCreateCommentReply'
import { useCreateCommentThread } from '../../../comments/hooks/useCreateCommentThread'
import { useDeleteComment } from '../../../comments/hooks/useDeleteComment'
import { useDeleteThread } from '../../../comments/hooks/useDeleteThread'
import { useEditComment } from '../../../comments/hooks/useEditComment'
import type { PendingCommentAnchor } from '../../../comments/types/comment.type'
import type {
  Comment,
  CommentThread,
} from '../../../comments/utils/comment-tree.util'

import { AprysePdfViewerRef } from './AprysePdfViewer'
import { DocumentTitleBar } from './DocumentTitleBar'
import { DocumentViewerShell } from './DocumentViewerShell'
import { DocumentViewerToolbar } from './DocumentViewerToolbar'
import { useEditPdf } from '../../hooks/useEditDocument'
import type { Document } from '../../types/document.type'
import { canCommentDocument } from '../../utils/documents.permission.util'
import { Header } from '../../../../shared/components/Header'
import { useAuthStore } from '../../../../shared/hooks/useAuthStore'

type FloatingThreadSource = 'anchor' | 'sidebar'

const FULL_THREAD_POPOVER_WIDTH = 312

type PendingDelete =
  | {
    type: 'comment'
    comment: Comment
    thread: CommentThread
  }
  | {
    type: 'thread'
    thread: CommentThread
  }
  | null

interface DocumentDetailExperienceProps {
  workspaceId: string
  documentId: string
  document: Document
  backElement: ReactNode
}

type CommentAwareApryseRef = AprysePdfViewerRef & {
  renderCommentThreads?: (threads: CommentThread[]) => void | Promise<void>
  scrollToCommentAnnotation?: (annotationId: string) => void | Promise<void>
  highlightCommentAnnotation?: (annotationId: string) => void
  removeTemporaryCommentAnchor?: () => void
}

function getViewerLeftPopoverPosition(viewerElement: HTMLElement | null) {
  if (!viewerElement) {
    return {
      x: 24,
      y: 160,
      maxHeight: Math.max(180, window.innerHeight - 172),
    }
  }

  const rect = viewerElement.getBoundingClientRect()
  const top = rect.top + 16

  return {
    x: rect.left + 12,
    y: top,
    maxHeight: Math.max(180, rect.bottom - top - 12),
  }
}

function getAnchorPopoverPosition(position: { x: number; y: number }) {
  const width = 360
  const estimatedHeight = 52
  const margin = 16
  const viewportWidth = window.innerWidth || width + margin * 2
  const viewportHeight = window.innerHeight || estimatedHeight + margin * 2
  const maxX = Math.max(margin, viewportWidth - width - margin)
  const maxY = Math.max(margin, viewportHeight - estimatedHeight - margin)

  return {
    x: Math.min(Math.max(margin, position.x + 24), maxX),
    y: Math.min(Math.max(margin, position.y - 16), maxY),
  }
}

function getMarkerPreviewPosition(position: { x: number; y: number }) {
  const width = 300
  const estimatedHeight = 126
  const margin = 12
  const viewportWidth = window.innerWidth || width + margin * 2
  const viewportHeight = window.innerHeight || estimatedHeight + margin * 2
  const maxX = Math.max(margin, viewportWidth - width - margin)
  const maxY = Math.max(margin, viewportHeight - estimatedHeight - margin)

  return {
    x: Math.min(Math.max(margin, position.x + 12), maxX),
    y: Math.min(Math.max(margin, position.y - 24), maxY),
  }
}

function getViewerRightPopoverPosition(
  viewerElement: HTMLElement | null,
  anchorPosition?: { x: number; y: number } | null,
) {
  if (!viewerElement) {
    const top = Math.max(12, (anchorPosition?.y ?? 160) - 80)

    return {
      x: Math.max(12, window.innerWidth - FULL_THREAD_POPOVER_WIDTH - 24),
      y: top,
      maxHeight: Math.max(180, window.innerHeight - top - 12),
    }
  }

  const rect = viewerElement.getBoundingClientRect()
  const minTop = rect.top + 12
  const maxTop = Math.max(minTop, rect.bottom - 180)
  const preferredTop = anchorPosition ? anchorPosition.y - 96 : rect.top + 16
  const top = Math.min(Math.max(preferredTop, minTop), maxTop)

  return {
    x: Math.max(rect.left + 12, rect.right - FULL_THREAD_POPOVER_WIDTH - 12),
    y: top,
    maxHeight: Math.max(180, rect.bottom - top - 12),
  }
}

function getUserId(user: unknown) {
  if (!user || typeof user !== 'object') return null

  const record = user as {
    _id?: string
    id?: string
    userId?: string
  }

  return record._id ?? record.id ?? record.userId ?? null
}

export function DocumentDetailExperience({
  workspaceId,
  documentId,
  document,
  backElement,
}: DocumentDetailExperienceProps) {
  const viewerFrameRef = useRef<HTMLDivElement | null>(null)
  const apryseViewerRef = useRef<CommentAwareApryseRef | null>(null)

  const user = useAuthStore((state) => state.user)
  const currentUserId = getUserId(user)

  const canComment = canCommentDocument(document)

  const { data: commentThreads = [], isLoading: isLoadingComments } =
    useCommentThreads(
      workspaceId,
      documentId,
      Boolean(workspaceId && documentId && canComment),
    )

  const [isPdfEditing, setIsPdfEditing] = useState(false)

  const [commentsOpen, setCommentsOpen] = useState(false)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [hiddenAvatarMarkerId, setHiddenAvatarMarkerId] = useState<string | null>(
    null,
  )

  const [floatingThreadId, setFloatingThreadId] = useState<string | null>(null)
  const [floatingThreadPosition, setFloatingThreadPosition] = useState<{
    x: number
    y: number
    maxHeight?: number
  } | null>(null)
  const [floatingThreadSource, setFloatingThreadSource] =
    useState<FloatingThreadSource | null>(null)
  const [hoverPreview, setHoverPreview] = useState<{
    thread: CommentThread
    position: { x: number; y: number }
  } | null>(null)
  const hoverPreviewCloseTimeoutRef = useRef<number | null>(null)

  const [pendingCommentAnchor, setPendingCommentAnchor] =
    useState<PendingCommentAnchor | null>(null)
  const [pendingComposerPosition, setPendingComposerPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(
    null,
  )
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null)

  const editPdfMutation = useEditPdf(workspaceId as string)

  const createThreadMutation = useCreateCommentThread()
  const createReplyMutation = useCreateCommentReply()
  const editCommentMutation = useEditComment()
  const deleteCommentMutation = useDeleteComment()
  const deleteThreadMutation = useDeleteThread()

  const floatingThread = useMemo(
    () =>
      commentThreads.find(
        (thread) => thread.annotation._id === floatingThreadId,
      ) ?? null,
    [commentThreads, floatingThreadId],
  )

  const closeThreadPopover = () => {
    setFloatingThreadId(null)
    setFloatingThreadPosition(null)
    setFloatingThreadSource(null)
    setHiddenAvatarMarkerId(null)
    setReplyingToCommentId(null)
    setEditingCommentId(null)
  }

  const cancelHoverPreviewClose = () => {
    if (hoverPreviewCloseTimeoutRef.current === null) return

    window.clearTimeout(hoverPreviewCloseTimeoutRef.current)
    hoverPreviewCloseTimeoutRef.current = null
  }

  const closeHoverPreview = () => {
    cancelHoverPreviewClose()
    setHoverPreview(null)
  }

  const scheduleHoverPreviewClose = (annotationId?: string) => {
    cancelHoverPreviewClose()

    hoverPreviewCloseTimeoutRef.current = window.setTimeout(() => {
      hoverPreviewCloseTimeoutRef.current = null
      setHoverPreview((current) => {
        if (annotationId && current?.thread.annotation._id !== annotationId) {
          return current
        }

        return null
      })
    }, 140)
  }

  const handleCommentMarkerHover = (
    annotationId: string,
    clientPosition: { x: number; y: number },
  ) => {
    const thread = commentThreads.find(
      (candidate) => candidate.annotation._id === annotationId,
    )

    if (!thread || commentsOpen) return

    cancelHoverPreviewClose()
    setSelectedThreadId(annotationId)
    setHoverPreview({
      thread,
      position: getMarkerPreviewPosition(clientPosition),
    })
  }

  const handleCommentMarkerLeave = (annotationId: string) => {
    scheduleHoverPreviewClose(annotationId)
  }

  const openFullThreadFromPreview = (thread: CommentThread) => {
    const annotationId = thread.annotation._id
    closeHoverPreview()
    setSelectedThreadId(annotationId)
    setReplyingToCommentId(null)
    setEditingCommentId(null)
    setHiddenAvatarMarkerId(annotationId)
    setFloatingThreadId(annotationId)
    setFloatingThreadSource('anchor')
    setFloatingThreadPosition(
      getViewerRightPopoverPosition(viewerFrameRef.current),
    )
  }

  const openCommentsSidebar = () => {
    setCommentsOpen(true)
    closeHoverPreview()

    // Mở sidebar thì đóng mọi popup thread đang mở.
    closeThreadPopover()
  }

  const closeCommentsSidebar = () => {
    setCommentsOpen(false)
    setHiddenAvatarMarkerId(null)

    // Popup mở từ sidebar thuộc sidebar mode, đóng sidebar thì đóng luôn.
    if (floatingThreadSource === 'sidebar') {
      closeThreadPopover()
    }
  }

  const cancelPendingComment = () => {
    setPendingCommentAnchor(null)
    setPendingComposerPosition(null)
    apryseViewerRef.current?.removeTemporaryCommentAnchor?.()
  }

  const handleStartEditPdf = () => {
    setIsPdfEditing(true)

    // Edit PDF và comment mode không chạy cùng lúc.
    setCommentsOpen(false)
    closeThreadPopover()
    cancelPendingComment()
  }

  const handleSavePdf = async () => {
    if (!documentId) return

    const exportedPdf = await apryseViewerRef.current?.exportEditedPdf()
    if (!exportedPdf) return

    await editPdfMutation.mutateAsync({
      documentId,
      file: exportedPdf.file,
      editedRects: exportedPdf.editedRects,
      degradedAnnotationIds: exportedPdf.degradedAnnotationIds,
    })

    setIsPdfEditing(false)
  }

  const handleDocumentAnnotationClick = (
    annotationId: string,
    clientPosition: { x: number; y: number },
    source: 'marker' | 'annotation' = 'annotation',
  ) => {
    setSelectedThreadId(annotationId)

    if (commentsOpen) {
      // Khi sidebar đang mở, sidebar sở hữu selection.
      // Click annotation chỉ select/highlight, không mở anchor popup.
      return
    }

    setHiddenAvatarMarkerId(source === 'marker' ? annotationId : null)
    closeHoverPreview()
    setFloatingThreadId(annotationId)
    setFloatingThreadSource('anchor')
    setFloatingThreadPosition(
      getViewerRightPopoverPosition(viewerFrameRef.current),
    )
  }

  const handleSidebarThreadClick = async (thread: CommentThread) => {
    const annotationId = thread.annotation._id

    setSelectedThreadId(annotationId)
    setReplyingToCommentId(null)
    setEditingCommentId(null)

    await apryseViewerRef.current?.scrollToCommentAnnotation?.(annotationId)
    apryseViewerRef.current?.highlightCommentAnnotation?.(annotationId)

    setFloatingThreadId(annotationId)
    setFloatingThreadSource('sidebar')
    setFloatingThreadPosition(
      getViewerLeftPopoverPosition(viewerFrameRef.current),
    )
  }

  const handlePendingCommentAnchorCreated = (
    anchor: PendingCommentAnchor,
    clientPosition: { x: number; y: number },
  ) => {
    if (isPdfEditing || !canComment) return

    setPendingCommentAnchor(anchor)
    setPendingComposerPosition(getAnchorPopoverPosition(clientPosition))

    setCommentsOpen(false)
    closeThreadPopover()
  }

  const handleSubmitNewThread = async (body: string) => {
    if (!workspaceId || !documentId || !pendingCommentAnchor || !canComment) {
      return
    }

    try {
      const createdThread = await createThreadMutation.mutateAsync({
        workspaceId,
        documentId,
        payload: {
          pageNumber: pendingCommentAnchor.pageNumber,
          position: pendingCommentAnchor.position,
          xfdf: pendingCommentAnchor.xfdf ?? null,
          apryseAnnotationId: pendingCommentAnchor.apryseAnnotationId ?? null,
          content: body,
        },
      })

      cancelPendingComment()

      const createdAnnotationId =
        '_id' in createdThread ? String(createdThread._id) : null

      if (createdAnnotationId) {
        setSelectedThreadId(createdAnnotationId)
      }
    } catch (error) {
      throw error
    }
  }

  const handleSubmitReply = async (
    parentComment: Comment,
    body: string,
    thread: CommentThread,
  ) => {
    if (!workspaceId || !documentId || !canComment) return

    await createReplyMutation.mutateAsync({
      workspaceId,
      documentId,
      annotationId: thread.annotation._id,
      payload: {
        content: body,
        parentId: parentComment._id,
      },
    })

    setReplyingToCommentId(null)
  }

  const handleSaveEdit = async (
    comment: Comment,
    body: string,
    _thread: CommentThread,
  ) => {
    if (!workspaceId || !documentId || !canComment) return

    await editCommentMutation.mutateAsync({
      workspaceId,
      documentId,
      commentId: comment._id,
      payload: {
        content: body,
      },
    })

    setEditingCommentId(null)
  }

  const handleConfirmDelete = async () => {
    if (!workspaceId || !documentId || !pendingDelete || !canComment) return

    if (pendingDelete.type === 'comment') {
      await deleteCommentMutation.mutateAsync({
        workspaceId,
        documentId,
        commentId: pendingDelete.comment._id,
      })

      setPendingDelete(null)
      return
    }

    const deletedThreadId = pendingDelete.thread.annotation._id

    await deleteThreadMutation.mutateAsync({
      workspaceId,
      documentId,
      annotationId: deletedThreadId,
    })

    if (selectedThreadId === deletedThreadId) {
      setSelectedThreadId(null)
    }

    if (floatingThreadId === deletedThreadId) {
      closeThreadPopover()
    }

    setPendingDelete(null)
  }

  const deleteLoading =
    deleteCommentMutation.isPending || deleteThreadMutation.isPending

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Header showFunctions />

      <main className="flex min-h-0 flex-1 flex-col px-6 py-5">
        <div className=" mx-auto flex h-full w-full max-w-[1400px] flex-col">
          <div className="mb-4 flex shrink-0 items-center justify-between">
            {backElement}

            <DocumentViewerToolbar
              workspaceId={workspaceId}
              document={document}
              isPdfEditing={isPdfEditing}
              onStartEditPdf={handleStartEditPdf}
              onCancelEditPdf={() => setIsPdfEditing(false)}
              commentsOpen={commentsOpen && canComment}
              onOpenComments={canComment ? openCommentsSidebar : undefined}
            />
          </div>

          <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
            <DocumentTitleBar
              workspaceId={workspaceId}
              document={document}
              isPdfEditing={isPdfEditing}
              isSavingPdf={editPdfMutation.isPending}
              onCancelEditPdf={() => setIsPdfEditing(false)}
              onSavePdf={handleSavePdf}
            />

            <div
              ref={viewerFrameRef}
              className="relative min-h-0 flex-1 overflow-hidden"
            >
              <DocumentViewerShell
                document={document}
                isPdfEditing={isPdfEditing}
                viewerRef={apryseViewerRef}
                commentThreads={commentThreads}
                selectedCommentAnnotationId={selectedThreadId}
                hiddenCommentAvatarMarkerId={hiddenAvatarMarkerId}
                commentsDisabled={isPdfEditing || !canComment}
                showCommentAvatarMarkers={canComment && !commentsOpen}
                onCommentAnnotationClick={handleDocumentAnnotationClick}
                onCommentMarkerHover={handleCommentMarkerHover}
                onCommentMarkerLeave={handleCommentMarkerLeave}
                onPendingCommentAnchorCreated={handlePendingCommentAnchorCreated}
              />

              {hoverPreview && (
                <CommentThreadPreviewPopover
                  thread={hoverPreview.thread}
                  position={hoverPreview.position}
                  onMouseEnter={cancelHoverPreviewClose}
                  onMouseLeave={() =>
                    scheduleHoverPreviewClose(
                      hoverPreview.thread.annotation._id,
                    )
                  }
                  onOpenThread={openFullThreadFromPreview}
                />
              )}

              {pendingCommentAnchor && pendingComposerPosition && (
                <div
                  className="fixed z-50"
                  style={{
                    left: pendingComposerPosition.x,
                    top: pendingComposerPosition.y,
                  }}
                >
                  <CommentComposer
                    autoFocus
                    variant="inline"
                    disabled={createThreadMutation.isPending}
                    onSubmit={handleSubmitNewThread}
                    onCancel={cancelPendingComment}
                  />
                </div>
              )}

              <CommentThreadPopover
                open={Boolean(floatingThread)}
                thread={floatingThread}
                position={floatingThreadPosition}
                source={floatingThreadSource}
                currentUserId={currentUserId}
                editingCommentId={editingCommentId}
                replyingToCommentId={replyingToCommentId}
                onClose={closeThreadPopover}
                onStartReply={(comment) => {
                  setEditingCommentId(null)
                  setReplyingToCommentId(comment._id)
                }}
                onCancelReply={() => setReplyingToCommentId(null)}
                onSubmitReply={handleSubmitReply}
                onStartEdit={(comment) => {
                  setReplyingToCommentId(null)
                  setEditingCommentId(comment._id)
                }}
                onCancelEdit={() => setEditingCommentId(null)}
                onSaveEdit={handleSaveEdit}
                onRequestDeleteComment={(comment, thread) =>
                  setPendingDelete({
                    type: 'comment',
                    comment,
                    thread,
                  })
                }
                onRequestDeleteThread={(thread) =>
                  setPendingDelete({
                    type: 'thread',
                    thread,
                  })
                }
              />
            </div>

            <CommentPanel
              open={commentsOpen && canComment}
              threads={commentThreads}
              activeAnnotationId={selectedThreadId}
              loading={isLoadingComments}
              onClose={closeCommentsSidebar}
              onSelectThread={handleSidebarThreadClick}
            />
          </section>

        </div>
      </main>




      <DeleteCommentConfirmModal
        open={pendingDelete?.type === 'comment'}
        loading={deleteLoading}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <DeleteThreadConfirmModal
        open={pendingDelete?.type === 'thread'}
        loading={deleteLoading}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
