import type { SharedDocument } from '../../types/document.type'
import { SharedDocumentRow } from './SharedDocumentRow'

interface SharedDocumentTableProps {
  documents: SharedDocument[]
}

export function SharedDocumentTable({ documents }: SharedDocumentTableProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-stone-200 text-left text-sm font-medium text-stone-900">
          <th className="pb-3">File name</th>
          <th className="pb-3">Workspace</th>
          <th className="pb-3">Owner</th>
          <th className="pb-3">Role</th>
          <th className="pb-3">Updated date ↓</th>
        </tr>
      </thead>

      <tbody>
        {documents.map((document) => (
          <SharedDocumentRow key={document._id} document={document} />
        ))}
      </tbody>
    </table>
  )
}