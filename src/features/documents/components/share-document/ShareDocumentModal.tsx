import { X } from '@phosphor-icons/react'
import { useDocumentAccess } from '../../hooks/useDocumentAccess'
import { ShareAddPeopleBar } from './ShareAddPeopleView'
import { ShareAccessSection } from './ShareAccessSection'
import { ShareLinkSection } from './ShareLinkSection'

interface ShareDocumentModalProps {
  open: boolean
  workspaceId: string
  documentId: string
  documentTitle?: string
  onClose: () => void
}

export function ShareDocumentModal({
  open,
  workspaceId,
  documentId,
  documentTitle,
  onClose,
}: ShareDocumentModalProps) {
  const { data: access, isLoading } = useDocumentAccess(
    workspaceId,
    documentId,
    open,
  )

  if (!open) return null

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="relative w-full max-w-[550px] rounded-lg border border-stone-200 bg-white shadow-xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
      >
        <X size={16} />
      </button>

      <div className="px-4 pt-4 pb-3">
        <h2 className="pr-8 text-base font-normal text-stone-950">
          Share{' '}
          <span className="font-semibold">
            {documentTitle ?? 'document'}
          </span>
        </h2>

        <div className="mt-5">
          <ShareAddPeopleBar
            workspaceId={workspaceId}
            documentId={documentId}
          />
        </div>

        <div className="mt-4">
          <h3 className="mb-3 text-xs font-medium text-stone-500">
            Who has access
          </h3>

          {isLoading && (
            <p className="py-4 text-xs text-stone-500">Loading...</p>
          )}

          {access && (
            <ShareAccessSection
              access={access}
              workspaceId={workspaceId}
              documentId={documentId}
            />
          )}
        </div>
      </div>

      <ShareLinkSection workspaceId={workspaceId} documentId={documentId} />
    </div>
  </div>
)
}