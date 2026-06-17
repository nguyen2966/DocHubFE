import {
  ChatText,
  PencilSimple,
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
  isSavingPdf: boolean
  onStartEditPdf: () => void
  onCancelEditPdf: () => void
  onSavePdf: () => void
  commentsOpen?: boolean
  onOpenComments?: () => void
}

export function DocumentViewerToolbar({
  workspaceId,
  document,
  isPdfEditing,
  onStartEditPdf,
  onCancelEditPdf,
  onSavePdf,
  isSavingPdf,
  onOpenComments,
  commentsOpen,
}: DocumentViewerToolbarProps) {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2">
        <DocumentRoleBadge document={document} />

        {canEditDocument(document) && !isPdfEditing && (
          <button
            onClick={onStartEditPdf}
            type="button"
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50"
          >
            <PencilSimple size={16} />
            Edit PDF
          </button>
        )}

        {canEditDocument(document) && isPdfEditing && (
          <>
            <button
              className="rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white"
              onClick={onSavePdf}
              disabled={isSavingPdf}
            >
              Save
            </button>

            <button
              onClick={onCancelEditPdf}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium"
            >
              Cancel
            </button>
          </>
        )}

        {canCommentDocument(document) && !isPdfEditing && (
          <button
            type="button"
            onClick={onOpenComments}
            className={`
            inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition
            ${commentsOpen
                      ? 'border-stone-950 bg-stone-950 text-white'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }
          `}
          >
            <ChatText size={16} />
            Comments
          </button>
        )}

        {canManageDocumentAccess(document) && (
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50"
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