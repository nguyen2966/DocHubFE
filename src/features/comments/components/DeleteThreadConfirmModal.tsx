import { Trash, X } from '@phosphor-icons/react'

interface DeleteThreadConfirmModalProps {
  open: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteThreadConfirmModal({
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteThreadConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[380px] rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Trash size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-950">
                Delete thread?
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                This will delete the whole discussion thread and all of its
                replies from the document view.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-stone-400 hover:bg-stone-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}