import { File } from '@phosphor-icons/react'

import type { Document } from '../../types/document.type'
import { DocumentActionMenu } from './DocumentActionMenu'

interface DocumentRowProps {
  workspaceId: string
  document: Document
}

export function DocumentRow({ workspaceId, document }: DocumentRowProps) {
  const ownerName =
    typeof document.ownerId === 'object'
      ? document.ownerId.fullName
      : 'Unknown'

  const updatedDate = new Date(document.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <tr className="border-b border-stone-200 text-sm hover:bg-stone-50">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-stone-100 text-stone-500">
            <File size={16} />
          </div>

          <span className="font-medium text-stone-900">{document.title}</span>
        </div>
      </td>

      <td className="py-3 text-stone-800">{ownerName}</td>

      <td className="py-3 text-stone-800">{updatedDate}</td>

      <td className="relative py-3 text-right">
        <DocumentActionMenu workspaceId={workspaceId} document={document} />
      </td>
    </tr>
  )
}
