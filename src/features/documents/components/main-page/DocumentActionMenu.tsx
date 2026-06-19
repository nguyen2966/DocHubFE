import { DotsThreeVertical, LinkSimple, PencilSimple, X } from '@phosphor-icons/react';
import { FileOutput, Trash } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Document } from '../../types/document.type';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';
import { useRenameDocument } from '../../hooks/useRenameDocument';
import {
  canDeleteDocument,
  canManageDocumentAccess,
  canRenameDocument,
} from '../../utils/documents.permission.util';;
import { RenameModal } from './RenameModal';
import { errorToast, successDeleteToast, successToast } from '../../../../shared/components/ui/Toast';

interface DocumentActionMenuProps {
  workspaceId: string
  document: Document
}

export function DocumentActionMenu({
  workspaceId,
  document,
}: DocumentActionMenuProps) {
  const navigate = useNavigate()

  const [openMenu, setOpenMenu] = useState(false)
  const [openRenameModal, setOpenRenameModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const renameDocument = useRenameDocument(workspaceId)
  const deleteDocument = useDeleteDocument(workspaceId)

  const handleOpenFile = () => {
    setOpenMenu(false)
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
          setOpenRenameModal(false);
          setOpenMenu(false);
          successToast("Rename document successfully");
        },
      },
    )
  }

  const handleDelete = () => {
    deleteDocument.mutate(document._id, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        setOpenMenu(false);
        successDeleteToast("Document removed successfully");
      },
      onError: () => {
        errorToast('Failed to delete document');
      },
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenMenu((prev) => !prev)}
        className="rounded-lg px-2 py-1 hover:bg-stone-100"
      >
        <DotsThreeVertical size={20} />
      </button>

      {openMenu && (
        <div className="absolute right-0 top-10 z-10 w-40 rounded-xl border border-stone-200 bg-white py-2 text-left shadow-lg">
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
                setOpenMenu(false)
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
              onClick={() => {
                setOpenMenu(false)
                // TODO: mở ShareDocumentModal ở bước sau
              }}
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
                  setOpenMenu(false)
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

      {openDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[380px] rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <Trash size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-stone-950">
                    Delete document?
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">
                    This will permanently delete "{document.title}". This
                    action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenDeleteModal(false)}
                className="rounded-md p-1 text-stone-400 hover:bg-stone-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={deleteDocument.isPending}
                onClick={() => setOpenDeleteModal(false)}
                className="rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteDocument.isPending}
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
