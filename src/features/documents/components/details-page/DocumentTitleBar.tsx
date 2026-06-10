import { PencilSimple } from '@phosphor-icons/react';
import { useState } from 'react';
import type { Document } from '../../types/document.type';
import { useRenameDocument } from '../../hooks/useRenameDocument';
import { canRenameDocument } from '../../utils/documents.permission.util';
import { RenameModal } from '../main-page/RenameModal';

interface DocumentTitleBarProps {
  workspaceId: string
  document: Document
}

export function DocumentTitleBar({
  workspaceId,
  document,
}: DocumentTitleBarProps) {
  const [openRenameModal, setOpenRenameModal] = useState(false)
  const renameDocument = useRenameDocument(workspaceId)

  const handleRename = (title: string) => {
    renameDocument.mutate(
      {
        documentId: document._id,
        payload: { title },
      },
      {
        onSuccess: () => {
          setOpenRenameModal(false)
        },
      },
    )
  }

  return (
    <>
      <div className="flex h-14 items-center gap-3 border-b border-stone-200 px-5">
        <h1 className="text-lg font-semibold text-stone-950">
          {document.title}
        </h1>

        {canRenameDocument(document) && (
          <button
            type="button"
            onClick={() => setOpenRenameModal(true)}
            className="rounded-md p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          >
            <PencilSimple size={16} />
          </button>
        )}
      </div>

      <RenameModal
        open={openRenameModal}
        title="Rename document"
        initialValue={document.title}
        loading={renameDocument.isPending}
        onClose={() => setOpenRenameModal(false)}
        onSubmit={handleRename}
      />
    </>
  )
}