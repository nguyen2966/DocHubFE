import { useState } from 'react'

import type { Document } from '../../types/document.type'
import { ShareDocumentModal } from '../share-document/ShareDocumentModal'
import { DocumentRow } from './DocumentRow'

interface DocumentTableProps {
  workspaceId: string
  documents: Document[]
}

export function DocumentTable({ workspaceId, documents }: DocumentTableProps) {
  const [openMenuDocumentId, setOpenMenuDocumentId] = useState<string | null>(
    null,
  )
  const [shareDocument, setShareDocument] = useState<Document | null>(null)

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-stone-200 text-left text-sm font-medium text-stone-900">
            <th className="pb-3">File name</th>
            <th className="pb-3">Owner</th>
            <th className="pb-3">Updated date ↓</th>
            <th className="w-10 pb-3" />
          </tr>
        </thead>

        <tbody>
          {documents.map((document) => (
            <DocumentRow
              key={document._id}
              workspaceId={workspaceId}
              document={document}
              menuOpen={openMenuDocumentId === document._id}
              onToggleMenu={() =>
                setOpenMenuDocumentId((current) =>
                  current === document._id ? null : document._id,
                )
              }
              onCloseMenu={() => setOpenMenuDocumentId(null)}
              onShare={() => {
                setOpenMenuDocumentId(null)
                setShareDocument(document)
              }}
            />
          ))}
        </tbody>
      </table>

      {shareDocument && (
        <ShareDocumentModal
          open={Boolean(shareDocument)}
          workspaceId={workspaceId}
          documentId={shareDocument._id}
          documentTitle={shareDocument.title}
          onClose={() => setShareDocument(null)}
        />
      )}
    </>
  )
}
