import {
  DotsThreeVertical,
  LinkSimple,
  PencilSimple,
} from '@phosphor-icons/react'
import { FileOutput, Trash } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DeleteConfirmModal } from '../../../../shared/components/ui/DeleteConfirmModal'
import {
  errorToast,
  successDeleteToast,
} from '../../../../shared/components/ui/Toast'
import { useDeleteDocument } from '../../hooks/useDeleteDocument'
import { useRenameDocument } from '../../hooks/useRenameDocument'
import type { Document } from '../../types/document.type'
import {
  canDeleteDocument,
  canManageDocumentAccess,
  canRenameDocument,
} from '../../utils/documents.permission.util'
import { RenameModal } from './RenameModal'

interface DocumentActionMenuProps {
  workspaceId: string
  document: Document
  open: boolean
  onToggle: () => void
  onClose: () => void
  onShare: () => void
}

export function DocumentActionMenu({
  workspaceId,
  document,
  open,
  onToggle,
  onClose,
  onShare,
}: DocumentActionMenuProps) {
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement | null>(null)

  const [openRenameModal, setOpenRenameModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const renameDocument = useRenameDocument(workspaceId)
  const deleteDocument = useDeleteDocument(workspaceId)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target

      if (
        target instanceof Node &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        onClose()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.document.addEventListener('mousedown', handleClickOutside)
    window.document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside)
      window.document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  const handleOpenFile = () => {
    onClose()
    navigate(`/workspaces/${workspaceId}/documents/${document._id}`)
  }

  const handleRename = (newTitle: string) => {
    renameDocument.mutate(
      {
        documentId: document._id,
        payload: {
          title: newTitle,
        },
      },
      {
        onSuccess: () => {
          setOpenRenameModal(false)
          onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    deleteDocument.mutate(document._id, {
      onSuccess: () => {
        setOpenDeleteModal(false)
        onClose()
        successDeleteToast('Document removed successfully')
      },
      onError: () => {
        errorToast('Failed to delete document')
      },
    })
  }

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={onToggle}
        className="rounded-lg px-2 py-1 hover:bg-stone-100"
      >
        <DotsThreeVertical size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-40 rounded-xl border border-stone-200 bg-white py-2 text-left shadow-lg">
          <button
            type="button"
            onClick={handleOpenFile}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-900 hover:bg-stone-50"
          >
            <FileOutput size={16} />
            Open file
          </button>

          {canRenameDocument(document) && (
            <button
              type="button"
              onClick={() => {
                setOpenRenameModal(true)
                onClose()
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-900 hover:bg-stone-50"
            >
              <PencilSimple size={16} />
              Rename
            </button>
          )}

          {canManageDocumentAccess(document) && (
            <button
              type="button"
              onClick={onShare}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-900 hover:bg-stone-50"
            >
              <LinkSimple size={16} />
              Share
            </button>
          )}

          {canDeleteDocument(document) && (
            <>
              <div className="my-1 border-t border-stone-100" />

              <button
                type="button"
                onClick={() => {
                  setOpenDeleteModal(true)
                  onClose()
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash size={16} />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      <RenameModal
        open={openRenameModal}
        title="Rename document"
        initialValue={document.title}
        loading={renameDocument.isPending}
        onClose={() => setOpenRenameModal(false)}
        onSubmit={handleRename}
      />

      <DeleteConfirmModal
        open={openDeleteModal}
        loading={deleteDocument.isPending}
        title="Delete document?"
        description={`This will permanently delete "${document.title}". This action cannot be undone.`}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
