import { File } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import type { SharedDocument } from '../../types/document.type'

interface SharedDocumentRowProps {
  document: SharedDocument
}

export function SharedDocumentRow({ document }: SharedDocumentRowProps) {
  const navigate = useNavigate()

  const updatedDate = document.updatedAt
    ? new Date(document.updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '-'

  return (
    <tr
      onClick={() => navigate(`/shared-with-me/documents/${document._id}`)}
      className="cursor-pointer border-b border-stone-200 text-sm hover:bg-stone-50"
    >
      <td className="py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-red-50 text-red-500">
            <File size={18} />
          </div>

          <span className="font-medium text-stone-900">
            {document.title}
          </span>
        </div>
      </td>

      <td className="py-3 text-stone-700">
        {document.workspaceName || '-'}
      </td>

      <td className="py-3 text-stone-700">
        {document.owner?.fullName ?? '-'}
      </td>

      <td className="py-3">
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium capitalize text-stone-700">
          {document.role}
        </span>
      </td>

      <td className="py-3 text-stone-700">{updatedDate}</td>
    </tr>
  )
}
