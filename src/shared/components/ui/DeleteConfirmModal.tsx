import { Trash } from '@phosphor-icons/react'

interface DeleteConfirmModalProps {
  open: boolean
  loading?: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmModal({
  open,
  loading = false,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
      <div className="w-[400px] rounded-xl bg-white text-left shadow-xl">
        <div className="flex gap-4 px-5 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <Trash size={20} weight="bold" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-stone-950">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-5 text-stone-500">
              {description}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-stone-100 px-5 py-4">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-900 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
