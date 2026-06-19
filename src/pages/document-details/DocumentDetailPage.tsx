

import { useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'

import { CommentComposer } from '../../features/comments/components/CommentComposer'
import { CommentPanel } from '../../features/comments/components/CommentPanel'
import { CommentThreadPopover } from '../../features/comments/components/CommentThreadPopover'
import { DeleteThreadConfirmModal } from '../../features/comments/components/DeleteThreadConfirmModal'
import { DeleteCommentConfirmModal } from '../../features/comments/components/DeleteCommentConfirmModal'
import { useCommentThreads } from '../../features/comments/hooks/useCommentThread'
import { useCreateCommentReply } from '../../features/comments/hooks/useCreateCommentReply'
import { useCreateCommentThread } from '../../features/comments/hooks/useCreateCommentThread'
import { useDeleteComment } from '../../features/comments/hooks/useDeleteComment'
import { useDeleteThread } from '../../features/comments/hooks/useDeleteThread'
import { useEditComment } from '../../features/comments/hooks/useEditComment'
import type { PendingCommentAnchor } from '../../features/comments/types/comment.type'
import type {
  Comment,
  CommentThread,
} from '../../features/comments/utils/comment-tree.util'

import { DocumentBackButton } from '../../features/documents/components/details-page/DocumentBackButton'
import {
  AprysePdfViewerRef,
} from '../../features/documents/components/details-page/AprysePdfViewer'
import { DocumentTitleBar } from '../../features/documents/components/details-page/DocumentTitleBar'
import { DocumentViewerShell } from '../../features/documents/components/details-page/DocumentViewerShell'
import { DocumentViewerToolbar } from '../../features/documents/components/details-page/DocumentViewerToolbar'
import { useDocumentDetail } from '../../features/documents/hooks/useDocumentDetail'
import { useEditPdf } from '../../features/documents/hooks/useEditDocument'
import { Header } from '../../shared/components/Header'
import { useAuthStore } from '../../shared/hooks/useAuthStore'

type FloatingThreadSource = 'anchor' | 'sidebar'

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
    }
  }

  const rect = viewerElement.getBoundingClientRect()

  return {
    x: rect.left + 24,
    y: rect.top + 140,
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

function getUserId(user: unknown) {
  if (!user || typeof user !== 'object') return null

  const record = user as {
    _id?: string
    id?: string
    userId?: string
  }

  return record._id ?? record.id ?? record.userId ?? null
}

export function WorkspaceDocumentDetailPage() {
  const { workspaceId, documentId } = useParams()

  const viewerFrameRef = useRef<HTMLDivElement | null>(null)
  const apryseViewerRef = useRef<CommentAwareApryseRef | null>(null)

  const user = useAuthStore((state) => state.user)
  const currentUserId = getUserId(user)

  const {
    data: document,
    isLoading,
    isError,
    error: documentError,
  } = useDocumentDetail(workspaceId, documentId)

  const { data: commentThreads = [], isLoading: isLoadingComments } =
    useCommentThreads(
      workspaceId,
      documentId,
      Boolean(workspaceId && documentId && document),
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
  } | null>(null)
  const [floatingThreadSource, setFloatingThreadSource] =
    useState<FloatingThreadSource | null>(null)

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

  const openCommentsSidebar = () => {
    setCommentsOpen(true)

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
    setFloatingThreadId(annotationId)
    setFloatingThreadSource('anchor')
    setFloatingThreadPosition(getAnchorPopoverPosition(clientPosition))
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
    if (isPdfEditing) return

    setPendingCommentAnchor(anchor)
    setPendingComposerPosition(getAnchorPopoverPosition(clientPosition))

    setCommentsOpen(false)
    closeThreadPopover()
  }

  const handleSubmitNewThread = async (body: string) => {
    if (!workspaceId || !documentId || !pendingCommentAnchor) return

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
    if (!workspaceId || !documentId) return

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
    if (!workspaceId || !documentId) return

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
    if (!workspaceId || !documentId || !pendingDelete) return

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

  if (isLoading) {
    return <div className="text-sm text-stone-500">Loading document...</div>
  }

  if (
    isAxiosError(documentError) &&
    (documentError.response?.status === 400 ||
      documentError.response?.status === 404 ||
      [400, 404].includes(
        (documentError.response?.data as { statusCode?: number } | undefined)
          ?.statusCode ?? 0,
      ))
  ) {
    return <Navigate to="/404" replace />
  }

  if (isError || !document || !workspaceId || !documentId) {
    return <div className="text-sm text-red-500">Document not found.</div>
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Header showFunctions />

      <main className="flex min-h-0 flex-1 flex-col px-6 py-5">
        <div className=" mx-auto flex h-full w-full max-w-[1400px] flex-col">
          <div className="mb-4 flex shrink-0 items-center justify-between">
            <DocumentBackButton workspaceId={workspaceId} />

            <DocumentViewerToolbar
              workspaceId={workspaceId}
              document={document}
              isPdfEditing={isPdfEditing}
              onStartEditPdf={handleStartEditPdf}
              onCancelEditPdf={() => setIsPdfEditing(false)}
              isSavingPdf={editPdfMutation.isPending}
              onSavePdf={handleSavePdf}
              commentsOpen={commentsOpen}
              onOpenComments={openCommentsSidebar}
            />
          </div>

          <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
            <DocumentTitleBar workspaceId={workspaceId} document={document} />

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
                commentsDisabled={isPdfEditing}
                showCommentAvatarMarkers={!commentsOpen}
                onCommentAnnotationClick={handleDocumentAnnotationClick}
                onPendingCommentAnchorCreated={handlePendingCommentAnchorCreated}
              />

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
              open={commentsOpen}
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
