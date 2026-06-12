import type { Document } from '../../types/document.type';
import { DocumentRow } from './DocumentRow';

interface DocumentTableProps {
  workspaceId: string
  documents: Document[]
}

export function DocumentTable({ workspaceId, documents }: DocumentTableProps) {
  return (
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
          />
        ))}
      </tbody>
    </table>
  )
}