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
    <div className="relative flex max-h-[560px] w-full max-w-[480px] flex-col rounded-lg border border-stone-200 bg-white shadow-xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
      >
        <X size={16} />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <h2 className="pr-8 text-base font-normal text-stone-950">
          Share{' '}
          <span className="font-semibold">
            {documentTitle ?? 'document'}
          </span>
        </h2>

        <div className="mt-4">
          <ShareAddPeopleBar
            workspaceId={workspaceId}
            documentId={documentId}
          />
        </div>

        <div className="mt-3">
          <h3 className="mb-2 text-xs font-medium text-stone-500">
            Who has access
          </h3>

          {isLoading && (
            <p className="py-4 text-xs text-stone-500">Loading...</p>
          )}

          <div className="max-h-[232px] overflow-y-auto pr-1">
            {access && (
              <ShareAccessSection
                access={access}
                workspaceId={workspaceId}
                documentId={documentId}
              />
            )}
          </div>
        </div>
      </div>

      <ShareLinkSection workspaceId={workspaceId} documentId={documentId} />
    </div>
  </div>
)
}
