import type { DocumentAccessSummary } from '../../types/document.type'
import { ShareAccessList } from './ShareAccessList'
import { ShareLinkSection } from './ShareLinkSection'

interface Props {
  workspaceId: string
  documentId: string
  documentTitle?: string
  access?: DocumentAccessSummary
  loading: boolean
  onClose: () => void
  onAddPeople: () => void
}

export function ShareMainView({
  workspaceId,
  documentId,
  documentTitle,
  access,
  loading,
  onClose,
  onAddPeople,
}: Props) {
  return (
    <div className="p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Share document</h2>
          {documentTitle && (
            <p className="mt-1 text-sm text-stone-500">{documentTitle}</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="rounded-full px-2 py-1 text-stone-500 hover:bg-stone-100"
        >
          ✕
        </button>
      </div>

      <button
        onClick={onAddPeople}
        className="mb-5 w-full rounded-xl border border-stone-300 px-4 py-3 text-left text-sm text-stone-600 hover:bg-stone-50"
      >
        Add people by email
      </button>

      <h3 className="mb-3 text-sm font-medium text-stone-800">
        People with access
      </h3>

      {loading && <p className="py-6 text-sm text-stone-500">Loading...</p>}

      {access && (
        <ShareAccessList
          access={access}
          workspaceId={workspaceId}
          documentId={documentId}
        />
      )}

      <ShareLinkSection workspaceId={workspaceId} documentId={documentId} />
    </div>
  )
}