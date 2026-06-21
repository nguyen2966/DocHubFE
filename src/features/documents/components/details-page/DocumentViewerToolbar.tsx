import {
  ChatText,
  NotePencil,
  ShareNetwork,
} from '@phosphor-icons/react'
import { useState } from 'react'
import type { Document } from '../../types/document.type'
import {
  canCommentDocument,
  canEditDocument,
  canManageDocumentAccess,
} from '../../utils/documents.permission.util'
import { DocumentRoleBadge } from './DocumentRoleBadge'
import { ShareDocumentModal } from '../share-document/ShareDocumentModal'

interface DocumentViewerToolbarProps {
  workspaceId: string
  document: Document
  isPdfEditing: boolean
  onStartEditPdf: () => void
  onCancelEditPdf: () => void
  commentsOpen?: boolean
  onOpenComments?: () => void
}

export function DocumentViewerToolbar({
  workspaceId,
  document,
  isPdfEditing,
  onStartEditPdf,
  onCancelEditPdf,
  onOpenComments,
  commentsOpen,
}: DocumentViewerToolbarProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const showEditPdf = canEditDocument(document)
  const showComments = canCommentDocument(document)
  const showShare = canManageDocumentAccess(document)
  const hasFunctionalButtons = showEditPdf || showComments || showShare

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <DocumentRoleBadge document={document} />

        {hasFunctionalButtons && (
          <span className="h-8 w-px bg-stone-200" aria-hidden="true" />
        )}

        {showEditPdf && (
          <button
            onClick={() => {
              if (isPdfEditing) {
                onCancelEditPdf()
                return
              }

              onStartEditPdf()
            }}
            type="button"
            aria-pressed={isPdfEditing}
            className={`flex h-8 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition ${
              isPdfEditing
                ? 'border-stone-400 bg-stone-100 text-stone-900'
                : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
            }`}
          >
            <NotePencil size={16} />
            Edit PDF
          </button>
        )}

        {showComments && (
          <button
            type="button"
            onClick={isPdfEditing ? undefined : onOpenComments}
            disabled={isPdfEditing}
            className={`
            inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition
            ${
              isPdfEditing
                ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400'
                : commentsOpen
                  ? 'border-stone-950 bg-stone-100 text-stone-900'
                  : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
            }
          `}
          >
            <ChatText size={16} />
            Comments
          </button>
        )}

        {showShare && (
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="flex h-8 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium hover:bg-stone-50"
          >
            <ShareNetwork size={16} />
            Share
          </button>
        )}
      </div>

      <ShareDocumentModal
        open={shareOpen}
        workspaceId={workspaceId}
        documentId={document._id}
        documentTitle={document.title}
        onClose={() => setShareOpen(false)}
      />
    </>
  )
}
